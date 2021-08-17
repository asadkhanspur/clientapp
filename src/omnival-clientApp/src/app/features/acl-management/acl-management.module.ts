
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclManagementRoutingModule } from './acl-management-routing.module';
import { AclManagementComponent } from './acl-management.component';
import { RoleManagementComponent, UserManagementComponent} from './components/index';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AclManagementComponent, RoleManagementComponent, UserManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    AclManagementRoutingModule,
  ]
})
export class AclManagementModule {
  constructor(){
    console.log('ACL Management Module Loaded')
  }
 }

