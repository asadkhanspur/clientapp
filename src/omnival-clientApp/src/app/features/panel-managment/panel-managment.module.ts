import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelManagmentRoutingModule } from './panel-managment-routing.module';
import { PanelManagmentComponent } from './panel-managment.component';


@NgModule({
  declarations: [PanelManagmentComponent],
  imports: [
    CommonModule,
    PanelManagmentRoutingModule
  ]
})
export class PanelManagmentModule {
  constructor(){
    console.log('Panel Managment Module Loaded')
  }
 }
