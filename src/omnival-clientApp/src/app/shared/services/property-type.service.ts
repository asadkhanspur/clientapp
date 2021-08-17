import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class PropertyTypeService extends BaseAPI {
  constructor(protected http: HttpClient) { 
    super(http);
    this.API_URL = '/api/orders/property-types';
  }


  getPropertyTypes(propertyCategoryTypeId){
    this.API_URL = `/api/property-types/${propertyCategoryTypeId}`;
    return this.getAll();
  }


  completePropertytyppeList(){
    this.API_URL = '/api/property-types';
    return this.getAll()
  }

}

