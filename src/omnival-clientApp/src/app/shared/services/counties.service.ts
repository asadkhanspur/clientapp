import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class CountiesService extends BaseAPI{

constructor(protected http: HttpClient) {
  super(http);
  this.API_URL = '/api/states/counties';
 }

 getByStateCode(stateCode){
  return this.getCallById('/api/states/'+ stateCode +'/counties')
}

}
