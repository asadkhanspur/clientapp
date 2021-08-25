
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class StateService extends BaseAPI {

  constructor(protected http: HttpClient) {
    super(http);
    this.API_URL = '/api/states/counties';
  }

  getPanelStates(filter?: any) {
    this.API_URL = '/api/States';
    return this.getAll(filter);
  }

}
