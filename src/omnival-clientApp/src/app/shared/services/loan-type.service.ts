import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class LoanTypeService extends BaseAPI{

constructor(protected http: HttpClient) {
  super(http);
  this.API_URL = '/api/loans/loan-types';
 }

 getLoanTyes(propertyCategoryTypeId){
  this.API_URL = `/api/property-category-type/${propertyCategoryTypeId}/loan-types`;
  return this.getAll();
}

completeLoanListCall(){
  this.API_URL = '/api/loan-types';
  return this.getAll();
}

}
