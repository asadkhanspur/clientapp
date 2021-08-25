import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends BaseAPI {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getCurrentVendors(filter?: any) {
    this.API_URL = "/api/clients/" + this.ClientId + "/CurrentVendors";
    return this.getAll(filter);
  }


  getCurrentVendorByState(stateCode) {
    this.API_URL = "/api/clients/" + this.ClientId + "/CurrentVendors/states/" + stateCode;
    return this.getAll(this.API_URL);
  }

  getAllVendorStates() {
    this.API_URL = `/api/clients/${this.ClientId}/AllVendorStates`;
    return this.getAll(this.API_URL);
  }
}