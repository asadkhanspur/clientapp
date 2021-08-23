import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlTemplateRoutingModule } from './html-template-routing.module';
import { HtmlTemplateComponent } from './html-template.component';


@NgModule({
  declarations: [HtmlTemplateComponent],
  imports: [
    CommonModule,
    HtmlTemplateRoutingModule
  ]
})
export class HtmlTemplateModule { }
