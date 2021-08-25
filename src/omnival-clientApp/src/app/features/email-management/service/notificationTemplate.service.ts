import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPI } from '../../../core/services';

@Injectable({
  providedIn: 'root'
})
export class NotificationTemplateService extends BaseAPI {

  private clientId = "0";

  constructor(protected http: HttpClient) {
    super(http);
    this.API_URL = "/api/notification-templates";
  }

  set setClientId(val: string) {
    this.clientId = val;
  }

  getClientNotificationTemplates(filter?: any) {
    this.API_URL = "/api/clients/" + this.clientId + "/notification-templates";
    return this.getAll(filter);
  }
  getClientNotificationTemplate(notificationTemplateId) {
    this.API_URL = "/api/clients/" + this.clientId + "/notification-templates/" + notificationTemplateId;
    return this.getCallById(this.API_URL);
  }
  putClientNotificationTemplate(clientNotificationTemplateId, model): Observable<any> {
    debugger;
    this.API_URL = "/api/clients/" + this.clientId + "/notification-templates/" + clientNotificationTemplateId;
    return this.putCall(this.API_URL, model);
  }
  putActiveClientNotificationTemplate(clientNotificationTemplateId, isForMobile): Observable<any> {
    debugger;
    this.API_URL = "/api/clients/" + this.clientId + "/notification-templates/" + clientNotificationTemplateId + "/enable/" + isForMobile;
    return this.putCall(this.API_URL, null);
  }
  putInActiveClientNotificationTemplate(clientNotificationTemplateId, isForMobile): Observable<any> {
    this.API_URL = "/api/clients/" + this.clientId + "/notification-templates/" + clientNotificationTemplateId + "/disable/" + isForMobile;
    return this.putCall(this.API_URL, null);
  }
  getNotificationTypes(filter?: any) {
    this.API_URL = "/api/clients/" + this.clientId + "/notification-types";
    return this.getAll(filter);
  }
}
