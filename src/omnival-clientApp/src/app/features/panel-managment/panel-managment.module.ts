import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelManagmentRoutingModule } from './panel-managment-routing.module';
import { PanelManagmentComponent } from './panel-managment.component';
import { PanelMapComponent, PanelTabsFilterComponent, PanelVendorStatisticsComponent, PanelTabsVendorDetailComponent} from './components/index';


@NgModule({
  declarations: [PanelManagmentComponent, PanelMapComponent, PanelTabsFilterComponent, PanelVendorStatisticsComponent, PanelTabsVendorDetailComponent],
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
