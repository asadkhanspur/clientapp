import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailManagementRoutingModule } from './email-management-routing.module';
import { EmailManagementComponent } from './email-management.component';


@NgModule({
  declarations: [EmailManagementComponent],
  imports: [
    CommonModule,
    EmailManagementRoutingModule
  ]
})
export class EmailManagementModule { }
