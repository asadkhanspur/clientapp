import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiResponse } from '../modals';
import { environment } from '../../../environments/environment';


@Injectable()
export abstract class BaseAPI {

  API_URL = '';
  ClientId = '';
  VendorId = '';

  private _headers: HttpHeaders;
  get headers(): HttpHeaders {
    this._headers = new HttpHeaders();
    const userToken = localStorage.getItem(environment.authTokenKey);

    if (!(userToken === null || userToken === undefined)) {
      this._headers = this._headers.set('accesstoken', userToken);
      this._headers = this._headers.set("Content_multipart", "multipart/form-data");
      this._headers = this._headers.set("Content_json", "application/json");
    }
    return this._headers;
  }

  constructor(protected http: HttpClient) {
    // this._headers = new HttpHeaders();
    // const userToken = localStorage.getItem(environment.authTokenKey);

    // if (!(userToken === null || userToken === undefined)) {
    //   this._headers = this._headers.set('accesstoken', userToken);
    // }
  }


  getAll(filterObject?: any): Observable<ApiResponse> {
    let queryString = '';
    if (filterObject) {
      const fitlerKeys: any[] = Object.keys(filterObject);
      if (fitlerKeys.length > 0) {
        queryString = '?';
      }
      fitlerKeys.forEach((key: any, index) => {
        if (filterObject[key] !== undefined && filterObject[key] !== null) {
          if (filterObject[key].toString().length) {
            queryString += `${key}=${filterObject[key]}&`;
          }
        }
      });
      if (
        fitlerKeys.length > 0 &&
        queryString[queryString.length - 1] === '&'
      ) {
        queryString = queryString.slice(0, -1);
      }
    }
    return this.http.get<ApiResponse>(environment.serverBaseUrl + this.API_URL + queryString, { headers: this.headers });
  }

  getById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.serverBaseUrl + this.API_URL + `/${id}`, { headers: this.headers });
  }



  // DELETE => delete the user from the server
  delete(id: number) {
    const url = `${environment.serverBaseUrl + this.API_URL}/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  // UPDATE => PUT: update the user on the server
  update(id: number, _obj: ApiResponse): Observable<any> {
    
    return this.http.put(environment.serverBaseUrl + this.API_URL + "/" + id, _obj, { headers: this.headers });
  }




  // CREATE =>  POST: add a new user to the server
  create(_obj: any): Observable<ApiResponse> {
   
    return this.http.post<ApiResponse>(environment.serverBaseUrl + this.API_URL, _obj, { headers: this.headers });
  }

  downloadById(id: number): Observable<any> {
    return this.http.get<any>(environment.serverBaseUrl + this.API_URL + `/download/${id}`, { headers: this.headers, responseType: 'blob' as 'json' });
  }

  getCallById(url: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.serverBaseUrl + url, { headers: this.headers });
  }

  postCall(url: string, _obj: any): Observable<ApiResponse> {
    //this.headers = this.headers.set("Content_multipart", "multipart/form-data");
    //this.headers = this.headers.set("Content_json", "application/json");
    return this.http.post<ApiResponse>(environment.serverBaseUrl + url, _obj, { headers: this.headers });
  }


  getFileCalls(url: string, _obj: any): Observable<any> {
    var fileheaders = new HttpHeaders();
    const userToken = localStorage.getItem(environment.authTokenKey);

    if (!(userToken === null || userToken === undefined)) {
      fileheaders = fileheaders.set('accesstoken', userToken);
    }
    return this.http.post<any>(environment.serverBaseUrl + url, _obj, {headers:fileheaders, responseType: 'blob' as 'json' });
  }
  




  putCall(url: string, _obj: any): Observable<ApiResponse> {
    //this.headers = this.headers.set("Content_multipart", "multipart/form-data");
    //this.headers = this.headers.set("Content_json", "application/json");
    return this.http.put<ApiResponse>(environment.serverBaseUrl + url, _obj, { headers: this.headers });
  }

  updateActive(url: string, _obj: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(environment.serverBaseUrl + url, _obj, { headers: this.headers });
  }


  // UPDATE => PUT: update Finish Wizard
  finishWizard(url: string): Observable<ApiResponse> {
    //this.headers = this.headers.set("Content_json", "application/json");
    return this.http.put<ApiResponse>(environment.serverBaseUrl + url, {}, { headers: this.headers });
  }


  deleteCall(url: string, id: number) {
    url = `${environment.serverBaseUrl + url}`;
    return this.http.delete(url, { headers: this.headers });
  }


  deleteCallDoc(nulls) {
    const url = `${environment.serverBaseUrl + this.API_URL}`;
    return this.http.delete(url, { headers: this.headers });

    //return this.http.delete(url, { headers: this.headers });
  }


  protected getCall(url: string, filterObject?: any): Observable<any> {
    let queryString = '';
    if (filterObject) {
      const fitlerKeys: any[] = Object.keys(filterObject);
      if (fitlerKeys.length > 0) {
        queryString = '?';
      }
      fitlerKeys.forEach((key: any, index) => {
        if (filterObject[key] !== undefined && filterObject[key] !== null) {
          if (filterObject[key].toString().length) {
            queryString += `${key}=${filterObject[key]}&`;
          }
        }
      });
      if (
        fitlerKeys.length > 0 &&
        queryString[queryString.length - 1] === '&'
      ) {
        queryString = queryString.slice(0, -1);
      }
    }

    return this.http.get(environment.serverBaseUrl + url + queryString, { headers: this.headers });
  }

  /*
   * Handle Http operation that failed.
   * Let the app continue.
   *
 * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }


}
