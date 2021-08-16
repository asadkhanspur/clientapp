import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseAPI } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupportingDocumentService extends BaseAPI {
    private clientId = "0";

    constructor(
        protected httpClient: HttpClient
    ) {
        super(httpClient);
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents";
    }

    set setClientId(val: string) {
        this.clientId = val;
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents";
    }

    postVendorDocument(model): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents";
        return this.postCall(this.API_URL, model);
    }
    postClientDocument(model): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents";
        return this.postCall(this.API_URL, model);
    }
    postClientDocumentTemplate(model): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/document-templates";
        return this.postCall(this.API_URL, model);
    }
    getClientDocuments(filter?: any) {
        this.API_URL = "/api/clients/" + this.clientId + "/documents";
        return this.getAll(filter);
    }
    putActiveDocument(clientSupportingDocumentId, documentCategoryTypeId, model) {
        if (documentCategoryTypeId == 1) {
            this.API_URL = "/api/clients/" + this.clientId + "/document-templates/" + clientSupportingDocumentId + '/enable';
            return this.putCall(this.API_URL, model);
        }
        else {
            this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId + '/enable';
            return this.putCall(this.API_URL, model);
        }

    }
    putInActiveDocument(clientSupportingDocumentId, documentCategoryTypeId, model) {
        if (documentCategoryTypeId == 1) {
            this.API_URL = "/api/clients/" + this.clientId + "/document-templates/" + clientSupportingDocumentId + '/disable';
            return this.putCall(this.API_URL, model);
        }
        else {
            this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId + '/disable';
            return this.putCall(this.API_URL, model);
        }

    }
    putVendorDocument(clientSupportingDocumentId, model): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId;
        return this.putCall(this.API_URL, model);
    }

    putClientDocumentTemplate(clientDocumentTemplateId, model): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/document-templates/" + clientDocumentTemplateId;
        return this.putCall(this.API_URL, model);
    }

    getClientDocumentTemplatePreview(clientDocumentTemplateId): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/preview/document-templates/" + clientDocumentTemplateId;
        return this.getCallById(this.API_URL);
    }

    putVdDoc(clientSupportingDocumentId, model): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId + "/upload-document"
        return this.putCall(this.API_URL, model);
    }


    // deleteDocMethod(clientSupportingDocumentId): Observable<any> {
    //     debugger
    //     this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId + "/delete-document"
    //     return this.deleteCallDoc(this.API_URL);
    // }

    model: boolean = false;
    deleteDocMethod(clientSupportingDocumentId): Observable<any> {
        debugger
        this.model = true;
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId + "/" + this.model
        return this.deleteCallDoc(this.API_URL);
    }

    deleteRec(clientSupportingDocumentId): Observable<any> {
        debugger
        this.model = false;
        this.API_URL = "/api/clients/" + this.clientId + "/supporting-documents/" + clientSupportingDocumentId + "/" + this.model
        return this.deleteCallDoc(this.API_URL);
    }

    deleteDocumentTemplate(documentId): Observable<any> {
        debugger
        this.model = false;
        this.API_URL = "/api/clients/" + this.clientId + "/document-templates/" + documentId;
        return this.deleteCallDoc(this.API_URL);
    }

    getClientDocumentTemplateConditions(clientDocumentTemplateId): Observable<any> {
        debugger
        this.API_URL = "/api/clients/" + this.clientId + "/document-templates/" + clientDocumentTemplateId+"/conditions";
        return this.getCallById(this.API_URL);
    }

}

