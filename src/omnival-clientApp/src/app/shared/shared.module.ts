import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DetailTabsComponent } from './components/detail-tabs/detail-tabs.component';

import { ButtonsModule } from 'ngx-bootstrap/buttons';


@NgModule({
  declarations: [DetailTabsComponent],
  imports: [
    CommonModule,
    ButtonsModule.forRoot()
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    DetailTabsComponent
  ],
})
export class SharedModule { }