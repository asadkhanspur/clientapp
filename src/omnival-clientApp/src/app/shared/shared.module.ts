import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DetailTabsComponent } from './components/detail-tabs/detail-tabs.component';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RouterModule } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [DetailTabsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    ButtonsModule.forRoot(),
    CollapseModule.forRoot()
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    CollapseModule,
    DetailTabsComponent,
  ]
})
export class SharedModule { }