import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseAPI } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClientBranchService extends BaseAPI {
    private clientId = "0";

    constructor(
        protected httpClient: HttpClient
    ) {
        super(httpClient);
        this.API_URL = "/clients/" + this.clientId + "/branches";
    }

    set setClientId(val: string) {
        this.clientId = val;
        this.API_URL = "/clients/" + this.clientId + "/branches";
    }

    postUser(model): Observable<any> {
        this.API_URL = "/clients/" + this.clientId + "/branches";
        return this.postCall(this.API_URL, model);
    }

    putUser(branchId, model): Observable<any> {
        this.API_URL = "/clients/" + this.clientId + "/branches/" + branchId;
        return this.putCall(this.API_URL, model);
    }


    getAllPreferdVendor(branchId): Observable<any> {
        this.API_URL = "/clients/" + this.clientId + "/branches/" + branchId + "/vendors";
        return this.getAll();
    }
    
    approveAllVendor(branchId): Observable<any> {
        debugger
        this.API_URL = "/clients/" + this.clientId + "/branches/" + branchId + '/vendors/approve-all';
        return this.postCall(this.API_URL,null);
    }

    PreferdVendorActiveStatusCall(branchId, vendorId,approve): Observable<any> {
        debugger
        this.API_URL = "/clients/" + this.clientId + "/branches/" + branchId + '/vendors/'+approve;
        return this.postCall(this.API_URL, {VendorId: vendorId});
    }

    PreferdVendorInActiveStatusCall(branchId, clientBranchPreferredVendorId,approve): Observable<any> {
        debugger
        this.API_URL = "/clients/" + this.clientId + "/branches/" + branchId + '/vendors/' + clientBranchPreferredVendorId+'/'+approve
        return this.deleteCall(this.API_URL, null);
    }

    getAllParentBranches(): Observable<any> {
        this.API_URL = "/clients/" + this.clientId + "/branches/parent";
        return this.getAll();
    }

    getAllSubBranches(brancheIds): Observable<any> {
        this.API_URL = "/clients/" + this.clientId + "/branches/subgroups/"+brancheIds;
        return this.getAll();
    }

    getAllBranches(): Observable<any> {
        this.API_URL = "/clients/" + this.clientId + "/branches";
        return this.getAll();
    }

}
