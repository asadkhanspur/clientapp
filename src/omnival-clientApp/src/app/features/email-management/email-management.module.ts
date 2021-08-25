import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailManagementRoutingModule } from './email-management-routing.module';
import { EmailManagementComponent } from './email-management.component';
import { NotificationListComponent, EmailManagementListComponent, EmailManagementMenuComponent } from './components';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [EmailManagementComponent, NotificationListComponent, EmailManagementListComponent, EmailManagementMenuComponent ],
  imports: [
    CommonModule,
    EmailManagementRoutingModule,
    Ng2SearchPipeModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTooltipModule,
    AngularEditorModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxDropzoneModule,
    MatCheckboxModule,
    FormsModule,
    BsDropdownModule,
    ReactiveFormsModule,
    ModalModule.forRoot()

  ]
})
export class EmailManagementModule { }
