import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseAPI } from 'src/app/core/services';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PanelManagmentService extends BaseAPI {

  constructor(
    protected httpClient: HttpClient
) {
    super(httpClient);
    this.API_URL = "";
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
