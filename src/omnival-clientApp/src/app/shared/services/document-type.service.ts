import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPI } from 'src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService extends BaseAPI{

constructor(protected http: HttpClient) {
  super(http);
  this.API_URL = '/api/clients/document-types';
 }

 getDocumentCategoryTypes() {
  return this.getCall("/api/clients/document-category-types");
}

getDocumentTypesByCategory(documentCategoryTypeId) {
  return this.getCall("/api/clients/document-category-types/" + documentCategoryTypeId + "/document-types");
}
}
