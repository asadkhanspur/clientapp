import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelTabsVendorDetailComponent } from './components';

import { PanelManagmentComponent } from './panel-managment.component';

const routes: Routes = [
  { 
    path: '', component: PanelManagmentComponent,
    children: [
      { path: 'currentVendors', component: PanelTabsVendorDetailComponent },
      { path: 'availableVendors', component: PanelTabsVendorDetailComponent },
      { path: 'pendingVendors', component: PanelTabsVendorDetailComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelManagmentRoutingModule { }
