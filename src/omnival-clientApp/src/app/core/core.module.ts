import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';


import { CoreComponent } from './core.component';
import { HeaderComponent, FooterComponent, LayoutComponent, SidebarComponent } from './components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [CoreComponent, HeaderComponent, FooterComponent, SidebarComponent, LayoutComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CoreRoutingModule,
    AccordionModule.forRoot(),
    BsDropdownModule,
    PopoverModule.forRoot(),
    CollapseModule,
  ]
})
export class CoreModule {

  constructor(){
    console.log('Core Module Loaded')
  }

 }
