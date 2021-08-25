
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ********* Model Import ********* //
import { ClientSignup, Credential, UserResponse } from '../modals'
// ********* Model Import ********* //

const API_USER_LOGIN = '/api/accounts/clients/signin';
const API_CLIENT_REGISTER = '/api/accounts/clients/signup';
const API_FORGOT_PASSWORD = '/api/accounts/clients/forgot-password';
const API_RESET_PASSWORD = '/api/accounts/clients/reset-password';
const API_CHECK_TOKEN = '/api/accounts/clients/validate-reset-token/';
const API_INSPECTION_CHECK_TOKEN = '/api/accounts/clients/validate-inspection-slot-token/';
const API_INSPECTION_POST_TOKEN = '/api/accounts/clients/post-inspection-slot/';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<Credential>;
  public currentUser: Observable<Credential>;
  permisionListArray: any = []

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Credential {
    return this.currentUserSubject.value;
  }



  // ***************** User Login Method *****************//
  login(username: string, password: string): Observable<UserResponse> {

    return this.http.post<UserResponse>(environment.serverBaseUrl + API_USER_LOGIN, { username, password })
      .pipe(
        tap(
          result => {

            if (result && result.data && result.data.accessToken) {
              try {
                console.log(result)
                localStorage.setItem('currentUser', JSON.stringify(result.data));
                localStorage.setItem('permissions', JSON.stringify(result.data.user.permissions));

                var usersss: any = { accessToken: result.data.accessToken, firstName: result.data.user.firstName, role: result.data.user.userRoleID };
                this.currentUserSubject.next(usersss);
                this.currentUserSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem('currentUser')));
                this.currentUser = this.currentUserSubject.asObservable();
              } catch (error) {
                console.log(`error on login : ${error}`);
                return error;
              }

            }
            return result;
          },
          (error: any) => {
            console.log(`error on retriving on login : ${error}`);
            return error;
          }
        ),
      )
  }
  // ***************** User Login Method *****************//


  // ***************** Get User Permissions Method *****************//
  getPermissions(clientId, userId): Observable<any> {
    var headers = new HttpHeaders();
    const userToken = localStorage.getItem(environment.authTokenKey);
    if (!(userToken === null || userToken === undefined)) {
      headers = headers.set('accesstoken', userToken);
    }
    return this.http.get<any>(environment.serverBaseUrl + '/api/accounts/clients/' + clientId + '/users/' + userId + '/get-permissions', { headers: headers })
      .pipe(
        tap(
          result => {

            if (result && result.data) {
              localStorage.setItem('permissions', JSON.stringify(result.data.permissions));
            }
            return result;
          }
        )
      )
  }
  // ***************** Get User Permissions Method *****************//


  // ***************** Check User Token Method *****************//
  checkToken(token: string) {
    return this.http.get<UserResponse>(environment.serverBaseUrl + API_CHECK_TOKEN + token)
  }
  // ***************** Check User Token Method *****************//


  // ***************** Check Inspection Slot Token Method *****************//
  checkInspectionSlotToken(token: string) {
    return this.http.get<UserResponse>(environment.serverBaseUrl + API_INSPECTION_CHECK_TOKEN + token)
  }
  // ***************** Check Inspection Slot Token Method *****************//


  // ***************** Update Inspection Slot Token Method *****************//
  updateInspectionSlot(token: string, model) {
    return this.http.post(environment.serverBaseUrl + API_INSPECTION_POST_TOKEN + token, model)
  }
  // ***************** Update Inspection Slot Token Method *****************//


  // ***************** Forgot Password Method *****************//
  forgotPass(userLogin: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(environment.serverBaseUrl + API_FORGOT_PASSWORD, { userLogin })
  }
  // ***************** Forgot Password Method *****************//

  // ***************** Reset Password Method *****************//
  resetPass(password: string, token: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(environment.serverBaseUrl + API_RESET_PASSWORD, { password: password, token: token })
  }
  // ***************** Reset Password Method *****************//


  // ***************** Client Signup Register Method *****************//
  register(user: ClientSignup): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post(environment.serverBaseUrl + API_CLIENT_REGISTER, user, { headers: httpHeaders })
      .pipe(
        tap(
          result => {

            if (result && result.data && result.data.accessToken) {
              localStorage.setItem('currentUser', JSON.stringify(result.data));
              localStorage.setItem('permissions', JSON.stringify(result.data.user.permissions));
              var usersss: any = { accessToken: result.data.accessToken, firstName: result.data.user.firstName, lastName: result.data.user.lastName, role: result.data.user.userRoleID, roleType: result.data.user.userTypeID, };
              this.currentUserSubject.next(usersss);
              this.currentUserSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem('currentUser')));
              this.currentUser = this.currentUserSubject.asObservable();
            }
            return result;
          }
        )
      )
  }
  // ***************** Client Signup Register Method *****************//


  // ***************** User Logout Method *****************//
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
  // ***************** User Logout Method *****************//


  // ***************** Set Permisions into localstorage Method *****************//
  permissionFunction() {
    var permissionList = [];
    var permissions = localStorage.getItem('permissions');
    if (permissions !== null && permissions !== undefined && permissions !== "undefined") {

      var _permissions = JSON.parse(localStorage.getItem('permissions'));
      if (_permissions !== undefined && _permissions !== null) {
        for (var i = 0; i < _permissions.length; i++) {
          permissionList[_permissions[i]] = true;
        }
      }
    }

    return permissionList;
  }
  // ***************** Set Permisions into localstorage Method *****************//

  isAlreadySignIn()
  {
    const currentUser = this.currentUserValue;
    if(currentUser){
      return true;
    }
    return false;
  }
}
