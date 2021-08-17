import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateTypeService extends BaseAPI {

  private clientId = "0";

  constructor(protected http: HttpClient) {
    super(http);
    this.API_URL = "/api/template-types";
  }

  set setClientId(val: string) {
    this.clientId = val;
  }

  getTemplateTypes(docuemntCategoryTypeId) {
    this.API_URL = "/api/template-types/" + docuemntCategoryTypeId;
    return this.getAll(this.API_URL);
  }

  getTemplateTypeVariableMapping(templateTypeId) {
    this.API_URL = "/api/template-type/" + templateTypeId + "/template-variable";
    return this.getAll(this.API_URL);
  }

  getClientEmailTemplates(filter?: any) {
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates";
    return this.getAll(filter);
  }

  getClientEmailTemplateById(emailTypeId, clientEmailTemplateId) {
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates/" + emailTypeId + "/" + clientEmailTemplateId;
    return this.getCallById(this.API_URL);
  }

  postClientEmailTemplate(model): Observable<any> {
    debugger
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates";
    return this.postCall(this.API_URL, model);
  }

  putClientEmailTemplate(emailTypeId, model): Observable<any> {
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates/" + emailTypeId ;
    return this.putCall(this.API_URL, model);
  }
  putActiveClientEmailTemplate(emailTypeId, model): Observable<any> {
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates/" + emailTypeId + "/enable";
    return this.putCall(this.API_URL, model);
  }
  putInActiveClientEmailTemplate(emailTypeId, model): Observable<any> {
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates/" + emailTypeId + "/disable";
    return this.putCall(this.API_URL, model);
  }

  deleteEmailTemplate(clientEmailTemplateId): Observable<any> {
    this.API_URL = "/api/clients/" + this.clientId + "/emails/templates/" + clientEmailTemplateId;
    return this.deleteCall(this.API_URL, clientEmailTemplateId);
  }


  getTemplate() {
    this.API_URL = "/api/clients/" + this.clientId + "/default-template";
    return this.getAll();
  }

}
