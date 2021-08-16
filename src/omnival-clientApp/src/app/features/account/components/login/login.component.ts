import { environment } from '../../../../../environments/environment'
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';


// ********* Services Import ********* //
import { AuthenticationService } from '../../../../core/services';
// ********* Services Import ********* //


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotForm: FormGroup;
  loading: boolean = false;
  loadingforgot: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  errorMessage: string = '';
  forgoterrormsg: string = '';
  hide = true;
  modalRef: BsModalRef;
  success: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private snackBar: MatSnackBar,
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit() {

    // ***************** Login Form Controller Define *****************//
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ["", Validators.compose([Validators.required])],
    });
    // ***************** Login Form Controller Define *****************//

    const my_object = [
      {Name: 'John', Salary: 100, Designation: 'Software engineer'},
      {Name: 'Deny', Salary: 200, Designation: 'Software engineer'},
      {Name: 'Alex', Salary: 300, Designation: 'Software engineer'}
    ];


    

    const newarray = my_object.map(function (value) {
     return {Name: value.Name, Salary:value.Salary+70}
      
    }); 
    console.log(newarray)
    

  }


  // ***************** Get Form Controller in to method *****************//  
  get f() { return this.loginForm.controls; }
  // ***************** Get Form Controller in to method *****************// 


  // ***************** Login Form Submit Method *****************// 
  onSubmit() {
    this.f.username.value.trim()
    this.f.password.value.trim()


    debugger
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }


    if (this.f.username.value.trim() == "") {
      debugger
      this.loginForm.controls['username'].setErrors({ 'invalid': true });
      return
    }

    if (this.f.password.value.trim() == "") {
      debugger
      this.loginForm.controls['password'].patchValue('');
      this.loginForm.controls['password'].setErrors({ 'invalid': true });
      return
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value.trim(), this.f.password.value.trim())
      .pipe(
        tap(result => {
          debugger
          if (result || result.error == undefined) {
            try {
              console.log(result)
              localStorage.setItem(environment.authTokenKey, result.data.accessToken);
              localStorage.setItem("userTypeId", result.data.user.userTypeID.toString());
              localStorage.setItem("userRoleId", result.data.user.userRoleID.toString());
              localStorage.setItem("clientID", result.data.user.clientID.toString());
              localStorage.setItem("firstName", result.data.user.firstName.toString());
              localStorage.setItem("lastName", result.data.user.lastName.toString());
              localStorage.setItem("shortName", result.data.user.shortName.toString());
              localStorage.setItem("isWizardCompleted", result.data.user.isWizardCompleted.toString());
              debugger
              if (result.data.user.isFirstLogin == true) {
                this.router.navigateByUrl('/account/changepassword');
                return;
              }

              if (localStorage.getItem("userTypeId").toString() == '1') { // For System Admin
                this.router.navigateByUrl('/dashboard');
                return;
              }
              else {
                if (result.data.user.isWizardCompleted) {
                  this.router.navigateByUrl('/dashboard'); // Main page
                  return;
                }
                else {
                  this.router.navigateByUrl('/wizard'); // Main page
                  return;
                }
                //this.router.navigateByUrl('/wizard'); // Main page
              }
            } catch (error) {
              console.log(`error set local storge on login : ${error}`);
              this.router.navigateByUrl('/loanlist'); // Main page
            }



          } else {
            console.log(`error on login`);
            this.loading = false;
            // this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
          }
        },
          (error: any) => {
            this.errorMessage = error.error.message;
            if (this.errorMessage == undefined) {
              this.errorMessage = "Server is not responding"
            }
            console.log(`error on retriving on login : ${error}`);
            this.loading = false;
          }
        ),
        finalize(() => { })
      )
      .subscribe();
  }
  // ***************** Login Form Submit Method *****************// 


  // ***************** Redirect Method *****************// 
  redirect() {
    debugger
    this.router.navigateByUrl("/dashboard")
  }
  // ***************** Redirect Method *****************//

}
