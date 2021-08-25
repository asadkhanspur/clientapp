import { BaseComponent } from '../../../../core/components';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { SignalRService} from "../../../../core/services";
import { RoleService} from "../../services"
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { accessType } from '../../../../core/enum';


// ********* Helper Import ********* //
import { HelperMethods } from '../../../../core/utils';
import { Subscription } from 'rxjs';
import { ErrorMessage,SuccessMessage } from '../../../../core/enum';
// ********* Helper Import ********* //

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent extends BaseComponent  implements OnInit {

  roleList = [];
  errorMessage: string = '';
  successMessage: any;
  loading: boolean;
  gifLoader = false;
  modalRef: BsModalRef;
  loadingforgot: boolean = false;
  roleForm: FormGroup;
  modal: any;
  isEdit: boolean;
  userRoleId: any;
  permissions: any;
  clientUserNames: string;
  accessFor: string;
  permissionEventCheck: boolean;
  permissionData: any;
  enable: boolean[] = [];
  currentUserId: number;
  private signalRSubscription: Subscription;
  @ViewChild(FormGroupDirective) userFormDirective;

  constructor(
    private RoleService: RoleService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private signalrService: SignalRService
  ) {
    super();
    this.signalRSubscription = this.signalrService.getRefreshData().subscribe(
      (refreshData) => {
        var clientId = localStorage.getItem("clientID");
        if (refreshData.clientId == parseInt(clientId) && refreshData.refeshDataOf == 7) {
          this.permissions = this.AuthenticationService.permissionFunction();
          this.getClientRoleList();
        }
      });
  }

  ngOnInit() {
    this.roleForm = this.formBuilder.group({
      clientRoleId: [''],
      roleName: ['', [Validators.required, Validators.maxLength(100), HelperMethods.trimValidator]],
      description: ['', [Validators.maxLength(1000)]],
    });

    this.getClientRoleList();
    this.reset();
    this.userRoleId = localStorage.getItem("userRoleId")
    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).user.userID;
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
          this.Error(ErrorMessage.fromServer,this.errorMessage);
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

  assignCustomPermission(assignToAllUser: boolean) {
    if (this.accessFor === accessType.fullAccess) {
      this.fullAccess(this.permissionEventCheck, assignToAllUser, this.permissionData);
    } else {
      this.changeAccess(this.permissionEventCheck, this.permissionData, this.accessFor, assignToAllUser);
    }
    this.modalRef.hide();
  }

  fullAccess(event, assignToAllUser, permission) {
    // this.gifLoaderForm = true;
    permission.isView = event;
    permission.isCreate = event;
    permission.isUpdate = event;
    permission.isDelete = event;

    var clientId = localStorage.getItem("clientID");
    this.RoleService
      .changePermission(clientId, this.modal.clientRoleId, permission.permissionId, assignToAllUser, permission, this.permissionEventCheck)
      .pipe(
        tap(result => {

          // this.successMessage = result
          // this.snackBar.open(this.successMessage.message, '', {
          //   duration: 8000,
          // });
          // this.getClientRoleList();
          // this.modalRef.hide();
          // this.gifLoaderForm = false;
          // this.snackBar.open('Changes Has Been Saved Successfully', '', {
          //   duration: 4000,
          // });
        },
          error => {
            this.loadingforgot = false
            this.errorMessage = error.error.message;
            this.Error(ErrorMessage.fromServer,this.errorMessage);
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

  fullAccessNew(event, permission) {
    permission.isView = event.checked;
    permission.isCreate = event.checked;
    permission.isUpdate = event.checked;
    permission.isDelete = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isView = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isCreate = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isUpdate = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isDelete = event.checked;

  }

  changeAccessNew(event, permission, accessFor) {
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
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isView = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isCreate = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isUpdate = event.checked;
    this.modal.permissions[this.modal.permissions.findIndex(x => x.permissionId == permission.permissionId)].isDelete = event.checked;
  }

  changeAccess(event, permission, accessFor, assignToAllUser) {
    // this.gifLoaderForm = true;
    switch (accessFor) {
      case 'view':
        permission.isView = event;
        permission.isCreate = permission.isCreate && event;
        permission.isUpdate = permission.isUpdate && event;
        permission.isDelete = permission.isDelete && event;
        break;
      case 'create':
        permission.isCreate = event;
        permission.isView = event == true ? true : permission.isView;
        break;
      case 'update':
        permission.isUpdate = event;
        permission.isView = event == true ? true : permission.isView;
        break;
      case 'delete':
        permission.isDelete = event;
        permission.isView = event == true ? true : permission.isView;
        break;
      default:
        break;
    }

    var clientId = localStorage.getItem("clientID");
    this.RoleService
      .changePermission(clientId, this.modal.clientRoleId, permission.permissionId, assignToAllUser, permission, this.permissionEventCheck)
      .pipe(
        tap(result => {

          // this.successMessage = result
          // this.snackBar.open(this.successMessage.message, '', {
          //   duration: 8000,
          // });
          // this.getClientRoleList();
          // this.modalRef.hide();
          // this.gifLoaderForm = false;
          this.Success(SuccessMessage.fromServer,'Changes Has Been Saved Successfully');

        },
          error => {
            this.gifLoaderForm = false;
            this.errorMessage = error.error.message;
            this.Error(ErrorMessage.fromServer,this.errorMessage);

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


  resetClientRolePermission(clientRoleId, deleteUserPermission) {
    var clientId = localStorage.getItem("clientID");
    this.RoleService.resetClientRolePermission(clientId, clientRoleId, deleteUserPermission).pipe(
      tap(result => {
        ;
        this.loadingforgot = false
        this.successMessage = result
        this.Success(SuccessMessage.fromServer,this.successMessage);
        this.getClientRoleList();
        this.modalRef.hide();
      },
        (error: any) => {
          ;
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);
          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  deleteRole(clientRoleId) {
    this.loadingforgot = true
    var clientId = localStorage.getItem("clientID");
    this.RoleService
      .deleteRole(clientId, clientRoleId)
      .pipe(
        tap(result => {

          this.loadingforgot = false
          this.successMessage = result
          this.Success(SuccessMessage.fromServer,this.successMessage);
          this.getClientRoleList();
          this.modalRef.hide();
        },
          error => {
            this.loadingforgot = false
            this.errorMessage = error.error.message;
            this.Error(ErrorMessage.fromServer,this.errorMessage);

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

  openPermissionModalWithClass(template: TemplateRef<any>, event, permission, accessFor, clientRoleId) {
    this.accessFor = accessFor;
    this.permissionEventCheck = event.checked;
    this.permissionData = permission;

    var clientId = localStorage.getItem("clientID");
    this.RoleService.checkCustomPermission(clientId, clientRoleId).pipe(
      tap(result => {
        ;
        if (result.data != null && result.data.length > 0) {

          this.clientUserNames = result.data.map(function (userFullName) {
            return userFullName;
          }).join(", ");

          this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'deletepopup' })
          );
        } else {
          if (this.accessFor === accessType.fullAccess) {
            this.fullAccess(this.permissionEventCheck, false, this.permissionData);
          } else {
            this.changeAccess(this.permissionEventCheck, this.permissionData, this.accessFor, false);
          }
        }
        console.log(result);
      },
        (error: any) => {
          ;
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);
          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  closePermissionCheck() {
    this.getRoleData(this.modal.clientRoleId);
    this.modalRef.hide()
  }

  reset() {
    this.roleForm.patchValue({
      clientRoleId: 0,
      roleName: '',
      description: '',
    });
    this.modal = {
      clientRoleId: 0,
      roleName: '',
      description: '',
      permissions: []
    }
  }
  openAddSlider(roleId) {
    this.onAdd();
  }
  closeAddSlider() {
    $(".addCheck").removeClass("openedpopeup");
  }
  isView = false;
  openEditSlider(roleId) {
    this.isView = false;
    if (roleId > 0) {
      this.onEdit(roleId);
    }
  }
  openViewSlider(data) {

    if (data.roleId == 1) {
      this.isView = true
    } else {
      this.isView = false
    }

    if (data.clientRoleId > 0) {
      this.onEdit(data.clientRoleId);
    }
  }

  closeEditSlider() {
    this.getClientRoleList();
    $(".editCheck").removeClass("openedpopeup");
  }

  onAdd() {
    this.errorMessage = "";
    this.reset();
    this.isEdit = true;
    var clientId = localStorage.getItem("clientID");
    this.RoleService.getForNewRole(clientId).pipe(
      tap(result => {

        this.roleForm.patchValue(result.data);
        this.modal = result.data;
        $(".addCheck").addClass("openedpopeup");
      },
        (error: any) => {
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);

          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  onEdit(id: number) {
    this.loadingforgot = true
    this.reset();
    this.isEdit = true;
    var clientId = localStorage.getItem("clientID");
    this.RoleService.getRole(clientId, id).pipe(
      tap(result => {

        this.roleForm.patchValue(result.data);
        this.modal = result.data;
        $(".editCheck").addClass("openedpopeup");
        this.loadingforgot = false
      },
        (error: any) => {
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);

          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  getRoleData(id: number) {
    this.loadingforgot = true
    var clientId = localStorage.getItem("clientID");
    this.RoleService.getRole(clientId, id).pipe(
      tap(result => {
        this.modal = result.data;
        this.loadingforgot = false
      },
        (error: any) => {
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);

          console.log(`error on retrieving role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  onSave(data) {
    this.create(data);
  }

  private create(data) {
    this.loadingforgot = true

    if (this.roleForm.status != "VALID") {
      this.loadingforgot = false
      return;
    }


    this.modal.clientRoleId = data.clientRoleId;
    this.modal.roleName = data.roleName;
    this.modal.description = data.description;

    var clientId = localStorage.getItem("clientID");
    this.RoleService.createRole(clientId, this.modal).pipe(
      tap(result => {
        this.loadingforgot = false
        this.successMessage = result.message;
        this.Success(SuccessMessage.fromServer,this.successMessage);
        this.roleForm.markAsPristine();
        this.getClientRoleList();
        $(".addCheck").removeClass("openedpopeup");
      },
        (error: any) => {
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);

          console.log(`error on create role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }
  gifLoaderForm = false;
  updateName(data) {
    this.gifLoaderForm = true

    if (this.roleForm.status != "VALID") {
      this.gifLoaderForm = false
      return;
    }



    var clientId = localStorage.getItem("clientID");
    this.RoleService.updateRole(clientId, data.clientRoleId, data).pipe(
      tap(result => {
        this.gifLoaderForm = false
        this.successMessage = result.message;
        this.Success(SuccessMessage.fromServer,this.successMessage);
        this.roleForm.markAsPristine();
      },
        (error: any) => {
          this.gifLoaderForm = false
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);

          console.log(`error on update role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  private update(data) {
    this.loadingforgot = true

    if (this.roleForm.status != "VALID") {
      this.loadingforgot = false
      return;
    }


    this.modal.clientRoleId = data.clientRoleId;
    this.modal.roleName = data.roleName;

    var clientId = localStorage.getItem("clientID");
    this.RoleService.updateRole(clientId, data.checklistTemplateId, this.modal).pipe(
      tap(result => {
        this.loadingforgot = false
        this.successMessage = result.message;
        this.Success(SuccessMessage.fromServer,this.successMessage);
        this.roleForm.markAsPristine();
        this.getClientRoleList();
        $(".addCheck").removeClass("openedpopeup");
      },
        (error: any) => {
          this.loadingforgot = false
          this.errorMessage = error.error.message;
          this.Error(ErrorMessage.fromServer,this.errorMessage);

          console.log(`error on update role data : ${error}`);
        }),
      finalize(() => {
      })
    )
      .subscribe();
  }

  // User ACtivate And Deactivate Methods

  @ViewChild('templatestatus') public defaultTemplate: TemplateRef<any>;

  // User ACtivate And Deactivate Methods
}

