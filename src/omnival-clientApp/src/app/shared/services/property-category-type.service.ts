import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class PropertyCategoryTypeService extends BaseAPI{

constructor(protected http: HttpClient) {
  super(http);
  this.API_URL = '/api/orders/property-category-types';
 }
 getallPropertyType(){
  this.API_URL = '/api/property-category-types';
  return this.getAll()
}

}
