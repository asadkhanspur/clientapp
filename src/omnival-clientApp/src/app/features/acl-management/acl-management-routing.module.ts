import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AclManagementComponent } from './acl-management.component';
import { RoleManagementComponent, UserManagementComponent,AclMenuComponent} from './components';

const routes: Routes = [
  {
    path: '',
    component: AclManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
      },
      { path: 'roles', component: RoleManagementComponent },
      { path: 'users', component: UserManagementComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclManagementRoutingModule { }



