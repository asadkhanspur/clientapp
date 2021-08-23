import { BaseComponent } from '../../../../core/components';
import { RefreshData } from '../../../../core/modals';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as $ from 'jquery';
import { AuthenticationService, SignalRService} from "../../../../core/services";
import { ClientContactTypeService, ClientBranchService, ClientUserService, ClientService} from "../../../../shared/services"
import { RoleService} from "../../services"
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { accessType } from '../../../../core/enum';


// ********* Helper Import ********* //
import { HelperMethods } from '../../../../core/utils';
import { Subscription } from 'rxjs';
// ********* Helper Import ********* //

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent extends BaseComponent  implements OnInit {

  roleList = [];
  hide = true;
  UserCustomForm: FormGroup;
  ChangePasswordFrom: FormGroup;
  clientUserList = [];
  contactType = [];
  branches = [];
  isCustomPermissionChanged = false;
  subGroups = []
  errorMessage: string = '';
  successMessage: any;
  loading: boolean;
  gifLoader = false;
  modalRef: BsModalRef;
  loadingforgot: boolean = false;
  modal: any;
  isEdit: boolean;
  userRoleId: any;
  userId: any;
  public heading: string = '';
  public btnHeading: string = '';
  allowRoleUpdate: boolean;
  enable: boolean[] = [];
  selectedRow: Number;
  currentUserId: number;
  UserBranchArray: any = []
  UserSubGroupArray: any = []
  SaveSelection: boolean[] = [];
  editSelection: boolean[] = [];
  private signalRSubscription: Subscription;
  @ViewChild(FormGroupDirective) userFormDirective;


  constructor(
    private fb: FormBuilder,
    private RoleService: RoleService,
    private ClientUserService: ClientUserService,
    private ClientContactTypeService: ClientContactTypeService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private ClientBranchService: ClientBranchService,
    private router: Router,
    private signalrService: SignalRService
  ) {
    super();
    this.signalRSubscription = this.signalrService.getRefreshData().subscribe(
      (refreshData) => {
        var clientId = localStorage.getItem("clientID");
        if (refreshData.clientId == parseInt(clientId) && refreshData.refeshDataOf == 7) {
          this.permissions =  this.AuthenticationService.permissionFunction();
          this.getClientRoleList();
        }
      });
  }

  ngOnInit() {
    // User form
    // ********* Company Profile Forms Values Declare ********* //
    this.UserCustomForm = this.formBuilder.group({
      //userTypeId: [0, Validators.compose([Validators.required])],
      clientRoleId: [0, [Validators.required, Validators.min(1)]],
      userRoleName: ['', []],
      contactTypeName: ['', []],
      userBranches: [[], []],
      userSubGroups: [[], []],
      userId: [0, [Validators.required]],
      contactTypeId: [0, [Validators.required, Validators.min(1)]],
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z-0-9 '.-]+$"), HelperMethods.trimValidator]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z-0-9 '.-]+$"), HelperMethods.trimValidator]],
      userEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      userWorkPhone: ['', [Validators.maxLength(100)]],
      userCellPhone: ['', [Validators.maxLength(100)]],
      isMasterUser: [false],
      isChangePasswordFirstLogin: [false],
      userLogin: ['', [Validators.required, Validators.maxLength(100), HelperMethods.cannotContainSpace]],
      password: ["", [Validators.required, HelperMethods.checkPassword]],
      confirmPassword: ["", [Validators.required, HelperMethods.checkPassword]],

    },
      {
        validator: HelperMethods.MatchPassword
      }
    );

    this.ChangePasswordFrom = this.formBuilder.group({
      password: ["", Validators.compose([Validators.required, HelperMethods.checkPassword])],
      confirmPassword: ["", Validators.compose([Validators.required, HelperMethods.checkPassword])],
      isChangePasswordFirstLogin: [false]
    },
      {
        validator: HelperMethods.MatchPassword
      }
    );

    // ********* Company Profile Forms Values Declare ********* //

    $(document).ready(function () {
      $("#openPop").click(function () {
        $(".LowVisibilityDivCreatedEditUser").addClass("openedpopeup");
      });


      $(".btn-close-edituser").click(function () {
        $(".LowVisibilityDivCreatedEditUser").removeClass("openedpopeup");
      });


      $(".btn-close-change-password").click(function () {

        $(".LowVisibilityDivChangePassword").removeClass("openedpopeup");
      });
    });

    this.getClientRoleList();
    this.getclientUsers();
    this.getContactType();
    this.getclientbranches()
    this.reset();
    this.userRoleId = localStorage.getItem("userRoleId")
    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).user.userID;
  }

  getclientbranches() {
    var clientId = localStorage.getItem("clientID");
    this.ClientBranchService.setClientId = clientId;
    this.ClientBranchService.getAllParentBranches().pipe(
      tap(result => {
        console.log(result)
        this.branches = result.data.clientBranches
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Branches list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }


 
  getclientUsers(filter?: any) {
    debugger
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    this.ClientUserService.getAll(filter).pipe(
      tap(result => {
        this.gifLoader = false
        console.log(result)

        this.clientUserList = result.data.clientUsers


      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving product type list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  getContactType() {
    this.gifLoader = true
    this.ClientContactTypeService
      .getAll()
      .pipe(
        tap(result => {
          this.contactType = result.data.clientContactTypes;
          this.gifLoader = false
        },
          (error: any) => {
            this.gifLoader = false
            this.errorMessage = error.error.message;
            console.log(`error on retriving state list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  getClientRoleList() {
    this.gifLoader = true
    var clientId = localStorage.getItem("clientID");
    this.RoleService.getRoleList(clientId).pipe(
      tap(result => {
        console.log(result)
        this.gifLoader = false
        this.roleList = result.data.clientRoles
        //this.roleList = this.roleList.filter(x => x.roleId != 1);
      },
        (error: any) => {
          this.gifLoader = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving roles : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

  fullAccessUser(event, permission) {
    // this.gifLoaderForm = true;
    permission.isView = event.checked;
    permission.isCreate = event.checked;
    permission.isUpdate = event.checked;
    permission.isDelete = event.checked;

    var clientId = localStorage.getItem("clientID");
    this.RoleService
      .changePermissionUser(clientId, this.modal.clientRoleId, this.modal.userId, permission.permissionId, permission)
      .pipe(
        tap(result => {

          // this.successMessage = result
          // this.snackBar.open(this.successMessage.message, '', {
          //   duration: 8000,
          // });
          // this.getClientRoleList();
          // this.modalRef.hide();
          // this.gifLoaderForm = false;
          this.snackBar.open('Changes Has Been Saved Successfully', '', {
            duration: 4000,
          });
          this.isCustomPermissionChanged = true
        },
          error => {
            this.loadingforgot = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            permission.isView = !event.checked;
            permission.isCreate = !event.checked;
            permission.isUpdate = !event.checked;
            permission.isDelete = !event.checked;
            this.gifLoaderForm = false;
          }),
        finalize(() => {
        })
      )
      .subscribe();
  }

  changeAccessUser(event, permission, accessFor) {
    // this.gifLoaderForm = true;
    switch (accessFor) {
      case 'view':
        permission.isView = event.checked;
        permission.isCreate = permission.isCreate && event.checked;
        permission.isUpdate = permission.isUpdate && event.checked;
        permission.isDelete = permission.isDelete && event.checked;
        break;
      case 'create':
        permission.isCreate = event.checked;
        permission.isView = event.checked == true ? true : permission.isView;
        break;
      case 'update':
        permission.isUpdate = event.checked;
        permission.isView = event.checked == true ? true : permission.isView;
        break;
      case 'delete':
        permission.isDelete = event.checked;
        permission.isView = event.checked == true ? true : permission.isView;
        break;
      default:
        break;
    }

    var clientId = localStorage.getItem("clientID");
    this.RoleService
      .changePermissionUser(clientId, this.modal.clientRoleId, this.modal.userId, permission.permissionId, permission)
      .pipe(
        tap(result => {

          // this.successMessage = result
          // this.snackBar.open(this.successMessage.message, '', {
          //   duration: 8000,
          // });
          // this.getClientRoleList();
          // this.modalRef.hide();
          // this.gifLoaderForm = false;
          this.snackBar.open('Changes Has Been Saved Successfully', '', {
            duration: 4000,
          });
          this.isCustomPermissionChanged = true
        },
          error => {
            this.gifLoaderForm = false;
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 4000,
            });
            switch (accessFor) {
              case 'view':
                permission.isView = !event.checked;
                permission.isCreate = permission.isCreate && !event.checked;
                permission.isUpdate = permission.isUpdate && !event.checked;
                permission.isDelete = permission.isDelete && !event.checked;
                break;
              case 'create':
                permission.isCreate = !event.checked;
                permission.isView = !event.checked == true;
                break;
              case 'update':
                permission.isUpdate = !event.checked;
                permission.isView = !event.checked == true;
                break;
              case 'delete':
                permission.isDelete = !event.checked;
                permission.isView = !event.checked == true;
                break;
              default:
                break;
            }
          }),
        finalize(() => {
        })
      )
      .subscribe();
  }

  resetUserRolePermission(userId) {
    this.loadingforgot = true;
    console.log("userId is: ", userId);
    var clientId = localStorage.getItem("clientID");
    this.RoleService.resetUserRolePermission(clientId, userId).pipe(
      tap(result => {
        ;
        this.loadingforgot = false
        this.successMessage = result
        this.snackBar.open(this.successMessage.message, '', {
          duration: 8000,
        });
        this.getclientUsers();
        this.modalRef.hide();
        this.loadingforgot = false;
      },
        (error: any) => {
          ;
          this.loadingforgot = false;
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'deletepopup' })
    );
  }

  
  reset() {
    this.modal = {
      clientRoleId: 0,
      roleName: '',
      description: '',
      permissions: []
    }
  }

  //Change Password Funcion
  changePassFunction(userid) {
    this.userId = userid
    this.ChangePasswordFrom.patchValue({ 'password': null });
    this.ChangePasswordFrom.patchValue({ "confirmPassword": null });
    //this.ChangePasswordFrom.controls["password"].setValue(null);
    //this.ChangePasswordFrom.controls["confirmPassword"].setValue(null);
    $(".LowVisibilityDivChangePassword").addClass("openedpopeup");

  }


  getErrorPasswordConfirmPass() {
    return this.ChangePasswordFrom.get('confirmPassword').hasError('required') ? 'Confirm Password is required' : '';
    //this.changeform.get('confirmPassword').hasError('minlength') ? 'Confirm password must contain at least 8 characters' : '';
    // this.changeform.get('confirmPassword').hasError('requirements') ? 'Password must contains at least 8 characters one numeric one uppercase one lowercase and one special character' : '';
  }


  getErrorPasswordUser() {
    return this.UserCustomForm.get('confirmPassword').hasError('required') ? 'Confirm Password is required' : '';

    //this.changeform.get('confirmPassword').hasError('minlength') ? 'Confirm password must contain at least 8 characters' : '';
    // this.changeform.get('confirmPassword').hasError('requirements') ? 'Password must contains at least 8 characters one numeric one uppercase one lowercase and one special character' : '';
  }


  //ChangePassword Form Send Method
  onChangePassword(data) {
    this.loadingforgot = true
    if (this.ChangePasswordFrom.invalid) {
      this.loadingforgot = false
      return
    }


    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    this.ClientUserService.changePasswordByUserId(this.userId, data)
      .pipe(
        tap(
          result => {
            this.snackBar.open(result.message, '', {
              duration: 8000,
            })
            this.loadingforgot = false;
            $(".LowVisibilityDivChangePassword").removeClass("openedpopeup");
          }, error => {
            this.loadingforgot = false;
            this.snackBar.open(error.error.message, '', {
              duration: 8000,
            });


          }
        ),
        finalize(() => { })
      )
      .subscribe();

  }


  isView = false;

  openEditSliderUser(roleId, userId) {
    this.isView = false;
    this.loadingforgot = true;
    this.onEditUserPermission(roleId, userId);
  }

  openViewSliderUser(data) {

    if (data.userRoleId == 1) {
      this.isView = true
    } else {
      this.isView = false
    }

    if (data.userRoleId > 0) {
      this.onEditUserPermission(data.userRoleId, data.userId);
    }


    // this.isView = true;
    // this.onEditUserPermission(roleId, userId);
  }


  closeEditSliderUser() {
    if (this.isCustomPermissionChanged == true) {
      this.getclientUsers();
      this.isCustomPermissionChanged = false
    } else {
      this.gifLoader = false;
    }

    $(".editUserCheck").removeClass("openedpopeup");
  }

  onEditUserPermission(id: number, userid: number) {

    this.reset();
    this.gifLoader = true;
    var clientId = localStorage.getItem("clientID");
    this.RoleService.getRoleUser(clientId, id, userid).pipe(
      tap(result => {

        this.modal = result.data;
        $(".editUserCheck").addClass("openedpopeup");
        this.loadingforgot = false;
      },
        (error: any) => {
          this.gifLoader = false;
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  onEditUser(id: number, i) {

    // this.gifLoader = true
    this.editRowProductFun(i);
    this.isEdit = true;
    this.isView = false;
    this.UserCustomForm.enable();
    this.ChangePasswordFrom.controls['']

    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    this.UserCustomForm.controls["password"].disable();
    this.UserCustomForm.controls["confirmPassword"].disable();
    this.UserCustomForm.controls["isChangePasswordFirstLogin"].disable();
    this.UserCustomForm.controls["userLogin"].disable();

    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).user.userID;
    this.ClientUserService.getById(id).pipe(
      tap(result => {


        var _userBranch = [];
        result.data.userBranches.forEach(userBranch => {
          if (userBranch['isSelected'] == true) {
            _userBranch.push(userBranch.branchName);
          }
        });

        this.UserBranchArray = result.data.userBranches;

        var _userSubGroup = [];

        result.data.userSubGroups.forEach(userBranch => {
          if (userBranch['isSelected'] == true) {
            _userSubGroup.push(userBranch.branchName);
          }
        });
        this.UserSubGroupArray = result.data.userSubGroups;




        this.UserCustomForm.patchValue(result.data);
        this.UserCustomForm.patchValue({ "userEmail": result.data.email });
        this.UserCustomForm.controls["clientRoleId"].setValue(result.data.clientRoleId);
        this.UserCustomForm.controls["userRoleName"].setValue(result.data.userRoleName);
        this.UserCustomForm.patchValue({
          userSubGroups: _userSubGroup,
        });
        this.UserCustomForm.patchValue({
          userBranches: _userBranch,
        });
        this.getclientsubgroups(-1, false);

        this.allowRoleUpdate = this.userRoleId == "1" && this.userId != id
        // this.ProductSpecTypes = result.data.vendorProductName;
        $(".LowVisibilityDivCreatedEditUser").addClass("openedpopeup");
        this.loadingforgot = false
        // this.gifLoader = true
      },
        (error: any) => {
          // this.gifLoader = true
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retrieving User data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  getclientsubgroups(branchId, forAdd) {
    var selectedBracnhes = [];

    this.UserCustomForm.controls["userBranches"].value.forEach(element => {
      for (let index = 0; index < this.branches.length; index++) {
        const branche = this.branches[index];
        if (branche.branchName == element) {
          selectedBracnhes.push(branche.branchId)
        }
      }
    });
    if (forAdd) {
      selectedBracnhes.push(branchId);
    }
    // else{
    //   const index = selectedBracnhes.indexOf(branchId);
    //   selectedBracnhes.splice(index, 1);
    // }
    if (selectedBracnhes.length <= 0) {
      selectedBracnhes.push(-1);
    }

    var clientId = localStorage.getItem("clientID");
    this.ClientBranchService.setClientId = clientId;
    this.ClientBranchService.getAllSubBranches(selectedBracnhes.join(',')).pipe(
      tap(result => {
        console.log(result)
        this.subGroups = result.data.clientBranches

        var existingSubGroups = [];
        this.UserCustomForm.controls["userSubGroups"].value.forEach(element => {
          for (let index = 0; index < this.subGroups.length; index++) {
            const subGroup = this.subGroups[index];
            if (subGroup.branchName == element) {
              existingSubGroups.push(subGroup.branchName)
            }
          }
        });
        this.UserCustomForm.get('userSubGroups').setValue(existingSubGroups);
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on retriving Branches list : ${error}`);
        }
      ),
      finalize(() => {
        //this.changeDetectorRefs.detectChanges();
      })
    )
      .subscribe(
      );
  }

   // Client Side edit remove show Functionality on table
   editRowProductFun(index) {
    this.enable[index] = true
    this.selectedRow = index;
    this.SaveSelection[index] = !this.SaveSelection[index]
    this.editSelection[index] = !this.editSelection[index]
  }

  cancelRowProductFun(index) {
    this.enable[index] = false
    this.selectedRow = null;
    this.SaveSelection[index] = !this.SaveSelection[index]
    this.editSelection[index] = !this.editSelection[index]
  }



  onSubGroupRemoved(topping: string) {
    const toppings = this.UserCustomForm.get('userSubGroups').value as string[];
    this.removeFirst(toppings, topping);
    this.UserCustomForm.get('userSubGroups').setValue(toppings); // To trigger change detection
  }

  // Chips User Branch Method
  onToppingRemoved(topping: string) {
    const toppings = this.UserCustomForm.get('userBranches').value as string[];
    this.removeFirst(toppings, topping);
    this.UserCustomForm.get('userBranches').setValue(toppings); // To trigger change detection
    this.getclientsubgroups(-1, false);
  }


  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  // Reset Form Method
  resetForm() {
    this.UserCustomForm.reset();
  }

  changeBranches(event) {

    if (event.isUserInput) {
      var branchId;
      for (let index = 0; index < this.branches.length; index++) {
        const branche = this.branches[index];
        if (branche.branchName == event.source.value) {
          branchId = branche.branchId;
        }
      }
      if (event.source.selected) {
        this.getclientsubgroups(branchId, true);
      }
    }
  }

  gifLoaderForm = false;
  // User ACtivate And Deactivate Methods

  @ViewChild('templatestatus') public defaultTemplate: TemplateRef<any>;

  isblockedCurrentValue: boolean
  userIdIsBlocked: string

  CheckBlockState(event, userId) {

    this.userIdIsBlocked = userId
    this.isblockedCurrentValue = event.checked
    this.openModalIsBlocked(this.defaultTemplate);
  }


  openModalIsBlocked(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      this.config,
      // Object.assign({}, { class: 'deletepopup' })
    );
  }

  config = {
    ignoreBackdropClick: true,
    class: 'deletepopup'
  };

  closeModal() {
    this.modalRef.hide();
    this.getclientUsers();
  }

  deleteIsBlocked() {

    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    this.ClientUserService
      .putUserStatusActive(this.userIdIsBlocked, this.isblockedCurrentValue == true ? 'active' : 'de-active')
      .pipe(
        tap(result => {
          this.getclientUsers();
          this.modalRef.hide();
          this.successMessage = result
          this.snackBar.open(this.successMessage.message, '', {
            duration: 8000,
          });
          //this.getVendorCoverages();
          // this.modalRef.hide();
        },
          error => {
            //data.isServiceProvided = !event.checked;
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 8000,
            });
          }),
        finalize(() => {
        })
      )
      .subscribe();
  }

  // User ACtivate And Deactivate Methods

  // User actions

  viewUserId(userId) {
    this.onView(userId)
  }

  onView(id: number) {

    try {
      this.gifLoader = true
      this.isView = true;
      this.isEdit = true;

      this.ChangePasswordFrom.controls['']

      var clientId = localStorage.getItem("clientID");
      this.ClientUserService.setClientId = clientId;
      this.UserCustomForm.disable();

      this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).user.userID;
      this.ClientUserService.getById(id).pipe(
        tap(result => {


          var _userBranch = [];
          result.data.userBranches.forEach(userBranch => {
            if (userBranch['isSelected'] == true) {
              _userBranch.push(userBranch.branchName);
            }
          });

          this.UserBranchArray = result.data.userBranches;

          var _userSubGroup = [];

          result.data.userSubGroups.forEach(userBranch => {
            if (userBranch['isSelected'] == true) {
              _userSubGroup.push(userBranch.branchName);
            }
          });
          this.UserSubGroupArray = result.data.userSubGroups;




          this.UserCustomForm.patchValue(result.data);
          this.UserCustomForm.patchValue({ "userEmail": result.data.email });
          this.UserCustomForm.controls["clientRoleId"].setValue(result.data.clientRoleId);
          this.UserCustomForm.controls["userRoleName"].setValue(result.data.userRoleName);
          this.UserCustomForm.controls["contactTypeId"].setValue(result.data.contactTypeId);
          this.UserCustomForm.controls["contactTypeName"].setValue(result.data.contactTypeName);
          this.UserCustomForm.patchValue({
            userSubGroups: _userSubGroup,
          });
          this.UserCustomForm.patchValue({
            userBranches: _userBranch,
          });
          this.getclientsubgroups(-1, false);

          this.allowRoleUpdate = this.userRoleId == "1" && this.userId != id
          // this.ProductSpecTypes = result.data.vendorProductName;
          $(".LowVisibilityDivCreatedEditUser").addClass("openedpopeup");

          this.gifLoader = false

        },
          (error: any) => {
            this.gifLoader = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 2000,
            });
            console.log(`error on retrieving User data : ${error}`);
          }),
        finalize(() => {
        })
      )
        .subscribe();
    }
    catch {
      this.gifLoader = false
      this.isView = false;
      this.isEdit = false;
    }
  }

  SendPassLinkFunction(userName) {

    this.AuthenticationService.forgotPass(userName)
      .pipe(
        tap(
          result => {
            this.snackBar.open(result.message, '', {
              duration: 8000,
            })
            this.loadingforgot = false;
            this.modalRef.hide()
          }, error => {
            this.snackBar.open(error.error.message, '', {
              duration: 8000,
            });
            this.loadingforgot = false;
            this.modalRef.hide()
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }

  //User Delete Method
  deleteUser(userId) {
    this.loadingforgot = true
    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    this.ClientUserService
      .delete(userId)
      .pipe(
        tap(result => {

          this.loadingforgot = false
          this.successMessage = result
          this.snackBar.open(this.successMessage.message, '', {
            duration: 8000,
          });
          this.getclientUsers();
          this.modalRef.hide();
        },
          error => {
            this.loadingforgot = false
            this.errorMessage = error.error.message;
            this.snackBar.open(this.errorMessage, '', {
              duration: 8000,
            });
          }),
        finalize(() => {
        })
      )
      .subscribe();
  }

  resetUserPermissions(userId) {

  }

  // End User actions




  removeFields(userFormDirective) {
    userFormDirective.resetForm()
    this.UserCustomForm.reset()
  }

  onSaveUser(data, userFormDirective: FormGroupDirective): void {



    this.UserCustomForm.controls["userLogin"].enable();
    data = this.UserCustomForm.value
    if (this.UserCustomForm.status != "VALID") {
      this.markFormGroupTouched(this.UserCustomForm);
      return;
    }
    if (data.userId > 0) {
      this.updateUser(data, userFormDirective);

    }
    else {
      this.createUser(data, userFormDirective);

    }
  }

  private updateUser(data, userFormDirective) {

    this.loadingforgot = true;
    data.userBranches = [];
    this.UserCustomForm.controls["userBranches"].value.forEach(element => {
      for (let index = 0; index < this.branches.length; index++) {
        const branche = this.branches[index];
        if (branche.branchName == element) {
          data.userBranches.push({ branchId: branche.branchId })
        }
      }
    });

    data.userSubGroups = [];
    this.UserCustomForm.controls["userSubGroups"].value.forEach(element => {
      for (let index = 0; index < this.subGroups.length; index++) {
        const branche = this.subGroups[index];
        if (branche.branchName == element) {
          data.userSubGroups.push({ branchId: branche.branchId })
        }
      }
    });


    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    data.userTypeId = parseInt(localStorage.getItem('userTypeId'));
    this.ClientUserService.putUser(data.userId, data).pipe(
      tap(result => {
        this.UserCustomForm.controls["userLogin"].disable();
        this.loadingforgot = false
        this.snackBar.open(result.message, '', {
          duration: 8000,
        })
        this.getclientUsers();
        $(".LowVisibilityDivCreatedEditUser").removeClass("openedpopeup");
        userFormDirective.resetForm()
        this.UserCustomForm.reset()
        // this.UserCustomForm.markAsPristine();
        // this.UserCustomForm.markAsUntouched();
        // this.UserCustomForm.reset();
      },
        (error: any) => {
          this.UserCustomForm.controls["userLogin"].disable();
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on update Client User data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }


  private createUser(data, userFormDirective) {
    this.loadingforgot = true
    data.userBranches = [];
    this.UserCustomForm.controls["userBranches"].value.forEach(element => {
      for (let index = 0; index < this.branches.length; index++) {
        const branche = this.branches[index];
        if (branche.branchName == element) {
          data.userBranches.push({ branchId: branche.branchId })
        }
      }
    });

    data.userSubGroups = [];
    this.UserCustomForm.controls["userSubGroups"].value.forEach(element => {
      for (let index = 0; index < this.subGroups.length; index++) {
        const branche = this.subGroups[index];
        if (branche.branchName == element) {
          data.userSubGroups.push({ branchId: branche.branchId })
        }
      }
    });

    var clientId = localStorage.getItem("clientID");
    this.ClientUserService.setClientId = clientId;
    this.ClientUserService.create(data).pipe(
      tap(result => {
        debugger
        this.loadingforgot = false
        this.snackBar.open(result.message, '', {
          duration: 8000,
        })

        this.UserCustomForm.controls["userBranches"].patchValue = null
        this.UserCustomForm.controls["userSubGroups"].patchValue = null
        this.getclientUsers();
        $(".LowVisibilityDivCreatedEditUser").removeClass("openedpopeup");
        userFormDirective.resetForm()
        this.UserCustomForm.reset()
        // this.UserCustomForm.markAsPristine();
        // this.UserCustomForm.markAsUntouched();
        // this.UserCustomForm.reset();
      },
        (error: any) => {
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.snackBar.open(this.errorMessage, '', {
            duration: 2000,
          });
          console.log(`error on create Client User data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }


  //start filter
  userRoleIdFilterText: number = 0;
  contactTypeIdFilterText: number = 0;

  focusOutSearchInput(input: string) {

    if (input != undefined && input != null && this.keywordFilterText != input.trim()) {
      this.keywordFilterText = input.trim();
      console.log(input.trim());
      this.applyFilter();
    }
  }
  keywordFilterText: string = '';
  filter: any = {};
  private applyFilter() {

    this.filter = {};
    if (this.keywordFilterText.trim() != '') {
      this.filter.key = this.keywordFilterText;
    }

    if (this.userRoleIdFilterText != 0) {

      this.filter.userRoleId = this.userRoleIdFilterText;
    }

    if (this.contactTypeIdFilterText != 0) {

      this.filter.contactTypeId = this.contactTypeIdFilterText;
    }

    this.getclientUsers(this.filter);
  }

  // Uzairs work

  selectedUserType(input: number) {
    if (input != undefined && input != null && this.userRoleIdFilterText != input) {
      this.userRoleIdFilterText = input;
      console.log(input);
      this.applyFilter();
    }
  }

  selectedContactType(input: number) {

    if (input != undefined && input != null && this.contactTypeIdFilterText != input) {
      this.contactTypeIdFilterText = input;
      console.log(input);
      this.applyFilter();
    }
  }

  sendUserId(userId, i) {
    this.isView = false;
    if (userId > 0) {
      this.onEditUser(userId, i);
      this.heading = "Update User";
      this.btnHeading = "Update"
    }
    else {
      this.onAddUser();
      this.heading = "Add New User";
      this.btnHeading = "Add"
    }

  }

  onAddUser() {
    this.isEdit = false;
    this.isView = false;
    this.UserCustomForm.enable();
    this.errorMessage = "";
    this.UserCustomForm.controls["userLogin"].enable();
    this.UserCustomForm.controls["password"].enable();
    this.UserCustomForm.controls["confirmPassword"].enable();
    this.UserCustomForm.controls["isChangePasswordFirstLogin"].enable();
    this.reset();
  }


}

