import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelManagmentComponent } from './panel-managment.component';

const routes: Routes = [
  { path: '', component: PanelManagmentComponent },
  { path: 'detailpanel', component: PanelManagmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelManagmentRoutingModule { }
