import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class VendorLookupService extends BaseAPI {
  private Start_API_URL = "/api/vendors/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  getCurrentVendorProducts() {
    this.API_URL = `${this.Start_API_URL}${this.VendorId}/Products`;
    return this.getAll(this.API_URL);
  }

  getCurrentVendorStateCoverages() {
    this.API_URL = `${this.Start_API_URL}${this.VendorId}/state-coverages`;
    return this.getAll(this.API_URL);
  }

  getCurrentVendorUsers() {
    this.API_URL = `${this.Start_API_URL}${this.VendorId}/users`;
    return this.getAll(this.API_URL);
  }

  getCurrentVendorDocument() {
    this.API_URL = `${this.Start_API_URL}${this.VendorId}/supporting-documents`;
    return this.getAll(this.API_URL);
  }

  // Dictionary Type methods, must be discussed
  getProductTypes(filter?: any) {
    this.API_URL = '/api/products/product-types';
    return this.getAll(filter);
  }

  getVendorTypes(filter?: any) {
    this.API_URL = `${this.Start_API_URL}vendor-types`;
    return this.getAll(filter);
  }
}