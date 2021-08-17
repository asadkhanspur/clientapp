import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClientUserService extends BaseAPI {
    private clientId = "0";

    constructor(
        protected httpClient: HttpClient
    ) {
        super(httpClient);
        this.API_URL = "/api/clients/" + this.clientId + "/Users";
    }

    set setClientId(val: string) {
        this.clientId = val;
        this.API_URL = "/api/clients/" + this.clientId + "/Users";
    }

    putUserStatusActive(userID,isBlocked): Observable<any> {
        debugger
        this.API_URL = "/api/accounts/users" + "/" + userID + "/" + isBlocked;
        return this.putCall(this.API_URL, null);
      }

    postUser(model): Observable<any> {
        this.API_URL = "/api/clients/" + this.clientId + "/Users";
        return this.postCall(this.API_URL, model);
    }

    putUser(userId,model): Observable<any> {
        this.API_URL = "/api/clients/" + this.clientId + "/Users/" + userId;
        return this.putCall(this.API_URL, model);
    }


    changePassword(password: string): Observable<any>{
        debugger
        this.API_URL = "/api/accounts/clients/change-password";
        return this.postCall(this.API_URL, {password:password});
    }

    changePasswordByUserId(clientUserId, model): Observable<any>{
        this.API_URL = "/api/clients/" + this.clientId + "/Users/" + clientUserId + "/change-password";
        return this.putCall(this.API_URL, model)
    }

}