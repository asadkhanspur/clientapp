import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from '../../core/services';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService extends BaseAPI {

  constructor(
    protected httpClient: HttpClient,
  ) {
    super(httpClient);
    this.API_URL = '/api/clients/document-types';
  }

  getDocumentCategoryTypes() {
    return this.getCall("/api/clients/document-category-types");
  }

  getDocumentTypesByCategory(documentCategoryTypeId) {
    return this.getCall("/api/clients/document-category-types/" + documentCategoryTypeId + "/document-types");
  }

}
