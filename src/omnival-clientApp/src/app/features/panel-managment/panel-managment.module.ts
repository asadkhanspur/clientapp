import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelManagmentRoutingModule } from './panel-managment-routing.module';
import { PanelManagmentComponent } from './panel-managment.component';
import { PanelMapComponent, PanelTabsFilterComponent, PanelVendorStatisticsComponent, PanelTabsVendorDetailComponent, VendorDetailSliderComponent, VendorDetailSliderTabComponent} from './components/index';
import { HighchartsChartModule } from 'highcharts-angular'
import { UsMapModule } from 'angular-us-map';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [PanelManagmentComponent, PanelMapComponent, PanelTabsFilterComponent, PanelVendorStatisticsComponent, PanelTabsVendorDetailComponent, VendorDetailSliderComponent, VendorDetailSliderTabComponent],
  imports: [
    CommonModule,
    SharedModule,
    PanelManagmentRoutingModule,
    HighchartsChartModule,
    UsMapModule,
    MatSnackBarModule,
    Ng2SearchPipeModule,
    ModalModule.forRoot()
  ]
})
export class PanelManagmentModule {
  constructor(){
    console.log('Panel Managment Module Loaded')
  }
 }
