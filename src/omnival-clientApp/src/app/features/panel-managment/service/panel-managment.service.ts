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



}
