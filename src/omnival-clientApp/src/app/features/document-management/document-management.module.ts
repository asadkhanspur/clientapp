import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { DocumentManagementComponent } from './document-management.component';
import { DocumentListComponent, UploadDocumentComponent, TemplateDocumentComponent } from '../document-management/components';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DocumentManagementComponent, DocumentListComponent, UploadDocumentComponent, TemplateDocumentComponent],
  imports: [
    CommonModule,
    DocumentManagementRoutingModule,
    BsDropdownModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    PdfViewerModule,
    AngularEditorModule,
    MatTooltipModule,
    MatSnackBarModule,
    ModalModule.forRoot()
  ]
})
export class DocumentManagementModule { }
