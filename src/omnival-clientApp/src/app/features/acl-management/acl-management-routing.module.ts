import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AclManagementComponent } from './acl-management.component';
import { RoleManagementComponent, UserManagementComponent } from './components';

const routes: Routes = [
  { path: '', component: AclManagementComponent },
  { path: 'roles', component: RoleManagementComponent },
  { path: 'users', component: UserManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclManagementRoutingModule { }



