import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ClientService extends BaseAPI {
    constructor(protected http: HttpClient) { 
      super(http);
        this.API_URL = '/api/clients';
    }

    getCompanyProfile(clientId): Observable<any> {
      return this.getCallById('/api/clients' + `/${clientId}/company-profile`); 
    }

    updateCompanyProfile(clientId,model): Observable<any> {
      debugger
      return this.postCall('/api/clients' + `/${clientId}/company-profile`,model); 
    }

    wizardComplete(clientId): Observable<any> {
      debugger
      // this.API_URL = '/api/Clients' + `/${clientId}/wizard-completed`
      return this.finishWizard('/api/Clients' + `/${clientId}/wizard-completed`); 
    }


    updateProfile(clientId,model): Observable<any> {
      debugger
      return this.putCall('/api/Clients' +  `/${clientId}`,model); 
    }

    getTermsOfService(clientId): Observable<any> {
      return this.getCallById('/api/clients' + `/${clientId}/terms-of-service`); 
    }

    updateTermsOfService(clientId,model): Observable<any> {
      return this.postCall('/api/clients' + `/${clientId}/terms-of-service`,model); 
    }


    uploadLogo(clientId,model): Observable<any> {
      debugger
      return this.putCall('/api/clients' + `/${clientId}/upload-logo`,model); 
    }

    deleteLogo(clientId): Observable<any> {
      return this.putCall( '/api/clients' + `/${clientId}/delete-logo`, null); 
    }
  
    getClientSetting(clientId): Observable<any> {
      return this.getCallById('/api/clients' + `/${clientId}/settings`); 
    }
    
    putClientSetting(clientId,model): Observable<any> {
      return this.putCall('/api/clients' + `/${clientId}/settings`,model); 
    }
   
  }

