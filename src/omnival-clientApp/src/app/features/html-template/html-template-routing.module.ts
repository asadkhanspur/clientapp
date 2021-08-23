import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HtmlTemplateComponent } from './html-template.component';

const routes: Routes = [{ path: '', component: HtmlTemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HtmlTemplateRoutingModule { }
