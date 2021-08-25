import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class InvitationSendService extends BaseAPI {
  private Start_API_URL = "/api/clients/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  getInvitations(filter?: any) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/Invitations`;
    return this.getAll(filter);
  }

  removeVendorFormPanel(invitationId) {
    this.API_URL = `${this.Start_API_URL}${this.ClientId}/Invitations`;
    return this.delete(invitationId);
  }
}