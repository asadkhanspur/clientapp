import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from './../../../core/services';

@Injectable({
  providedIn: 'root'
})
export class ClientTypeService extends BaseAPI {
  constructor(protected http: HttpClient) { 
    super(http);
      this.API_URL = '/api/clients/client-types';
  }
}