import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentManagementComponent } from './document-management.component';
import { DocumentListComponent, UploadDocumentComponent, TemplateDocumentComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: DocumentManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'document-list',
        pathMatch: 'full'
      },
      { path: 'document-list', component: DocumentListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
