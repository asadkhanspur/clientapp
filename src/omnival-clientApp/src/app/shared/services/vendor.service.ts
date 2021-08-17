import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends BaseAPI{

constructor(protected http: HttpClient) {
  super(http);
  this.API_URL = '';
 }

 getCurrentVendor(clientId){
  this.API_URL = "/api/clients/" + clientId + "/CurrentVendors";
  return this.getAll(this.API_URL);
}


 getCurrentVendorByState(clientId, stateCode){
  this.API_URL = "/api/clients/" + clientId + "/CurrentVendors/states/" + stateCode;
  return this.getAll(this.API_URL);
}

getAllVendorStates(clientId){
  this.API_URL = `/api/clients/${clientId}/AllVendorStates`;
  return this.getAll(this.API_URL);
}

}
