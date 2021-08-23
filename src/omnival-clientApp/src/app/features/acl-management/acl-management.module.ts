
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclManagementRoutingModule } from './acl-management-routing.module';
import { AclManagementComponent } from './acl-management.component';
import { RoleManagementComponent, UserManagementComponent,AclMenuComponent} from './components/index';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [AclManagementComponent,AclMenuComponent, RoleManagementComponent, UserManagementComponent],
  imports: [
    CommonModule,
    AclManagementRoutingModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ModalModule.forRoot(),
    MatChipsModule,
    MatCheckboxModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BsDropdownModule.forRoot()
  ]
})
export class AclManagementModule {
  constructor(){
    console.log('ACL Management Module Loaded')
  }
 }

