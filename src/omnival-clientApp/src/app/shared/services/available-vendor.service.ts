import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class AvailableVendorService extends BaseAPI {
  private Start_API_URL = "/api/clients/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAvailableVendors(filter?: any) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/AvailableVendors`;
    return this.getAll(filter);
  }


  getAvailableVendorByState(stateCode) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/AvailableVendors/states/${stateCode}`;
    return this.getAll(this.API_URL);
  }
}