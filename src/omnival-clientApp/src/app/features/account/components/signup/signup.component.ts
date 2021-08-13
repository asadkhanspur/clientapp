import { BaseComponent } from 'src/app/core/components';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl } from "@angular/forms";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';


// ********* Services Import ********* //
import { AuthenticationService } from "../../../../core/services"
import { ClientTypeService } from "./../../service"
// ********* Services Import ********* //


// ********* Model Import ********* //
import { ClientSignup } from './../../modals'
// ********* Model Import ********* //

// ********* Helper Import ********* //
//import { MustMatch } from '../../core/_helpers/must-match.validator';
import { HelperMethods } from '../../../../core/utils';
import { environment } from '../../../../../environments/environment';
import { ExtendedScrollToOptions } from '@angular/cdk/scrolling';
// ********* Helper Import ********* //

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent extends BaseComponent implements OnInit {

  FirstsignUpForm: FormGroup;
  errorMessage: any
  clientTypes = []
  successSignup: string = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private ClientTypeService: ClientTypeService,
    //private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit()
    // ***************** SignUp Forms Controls Declare *****************// 
    this.FirstsignUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z-0-9 '.-]+$"), HelperMethods.trimValidator]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern("^[a-zA-Z-0-9 '.-]+$"), HelperMethods.trimValidator]],
      // clientTypeId: ["", Validators.compose([Validators.required])],
      clientTypeId: ["", [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      userLogin: ['', [Validators.required, Validators.maxLength(100), HelperMethods.cannotContainSpace]],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), HelperMethods.checkPassword])],
    },
    );
    // ***************** SignUp Forms Controls Declare *****************// 

    // ***************** Calls Post To Server *****************// 
    this.getClientType();
    // ***************** Calls Post To Server *****************//

  }

  // ***************** Get Password Error Method *****************// 
  getErrorPassword() {
    return this.FirstsignUpForm.get('password').hasError('required') ? 'Password is required' :
      this.FirstsignUpForm.get('password').hasError('requirements') ? 'Password must contains at least 8 characters one numeric one uppercase one lowercase and one special character' : '';
  }
  // ***************** Get Password Error Method *****************// 


  // ***************** Http Calls Method *****************// 
  getClientType() {
    this.ClientTypeService
      .getAll()
      .pipe(
        tap(result => {
          this.clientTypes = result.data.clientTypes;
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            console.log(`error on retriving Vendor type list : ${error}`);
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  // ***************** Http Calls Method *****************// 


  // ***************** Signup Form Method *****************//
  onSubmit() {
    debugger
    if (this.FirstsignUpForm.invalid) {
      //this.submitted = true;
      return;
    }
    // this.loading = true;
    const _user: ClientSignup = new ClientSignup();
    _user.clientTypeId = this.FirstsignUpForm.controls["clientTypeId"].value;
    _user.firstName = this.FirstsignUpForm.controls["firstName"].value.trim();
    _user.lastName = this.FirstsignUpForm.controls["lastName"].value.trim();
    _user.email = this.FirstsignUpForm.controls["email"].value;
    _user.userLogin = this.FirstsignUpForm.controls["userLogin"].value.trim();
    _user.password = this.FirstsignUpForm.controls["password"].value.trim();


    this.authenticationService
      .register(_user)
      .pipe(
        tap(user => {
          debugger
          if (!user.error) {
            localStorage.setItem(environment.authTokenKey, user.data.accessToken);
            localStorage.setItem("userTypeId", user.data.user.userTypeID.toString());
            localStorage.setItem("userRoleId", user.data.user.userRoleID.toString());
            localStorage.setItem("clientID", user.data.user.clientID.toString())
            localStorage.setItem("firstName", user.data.user.firstName.toString())
            localStorage.setItem("lastName", user.data.user.lastName.toString())
            localStorage.setItem("shortName", user.data.user.shortName.toString())
            if (localStorage.getItem("userTypeId").toString() == '1') { // For System Admin
              this.router.navigateByUrl('/vendors');
            }
            else {
              this.router.navigateByUrl('/account/signup'); // Main page
            }

          } else {
          }
        },

          error => {
            // this.loading = false;
            // this.errorMessage = error.error.message;
          }),
        finalize(() => {
        })
      )
      .subscribe();
  }
  // ***************** Signup Form Method *****************//

}
