import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailManagementComponent } from './email-management.component';

const routes: Routes = [{ path: '', component: EmailManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailManagementRoutingModule { }
