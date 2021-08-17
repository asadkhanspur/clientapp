import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AclManagementComponent } from './acl-management.component';

const routes: Routes = [
  { path: '', component: AclManagementComponent },
  { path: 'detailpanel', component: AclManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclManagementRoutingModule { }



