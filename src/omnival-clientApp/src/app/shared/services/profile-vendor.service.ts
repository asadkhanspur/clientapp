import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class ProfileVendorService extends BaseAPI {
  private Start_API_URL = "/api/profiles/vendors/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  getCurrentVendorViewProfile() {
    this.API_URL = `${this.Start_API_URL}${this.VendorId}`;
    return this.getAll(this.API_URL);
  }
}
