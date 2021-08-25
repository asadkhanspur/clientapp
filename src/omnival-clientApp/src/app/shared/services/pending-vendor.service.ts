import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class PendingVendorService extends BaseAPI {
  private Start_API_URL = "/api/clients/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  getPendingVendors(filter?: any) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/PendingVendors`;
    return this.getAll(filter);
  }

  cancelInvitation(invitationId) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/invitations`;
    return this.delete(invitationId)
  }


  getPendingVendorByState(stateCode) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/PendingVendors/states/${stateCode}`;
    return this.getAll(this.API_URL);
  }
  
  getVendorProductStatsByStateCode(stateCode) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/VendorProductTypeStats/states/${stateCode}`;
    return this.getAll(this.API_URL);
  }

  getVendorStatsByStateCode(stateCode) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/VendorStats/states/${stateCode}`;
    return this.getAll(this.API_URL);
  }
}