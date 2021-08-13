
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from './core/interceptor';
import { LowerCaseUrlSerializer } from './core/utils';
import { RouterModule, Router, UrlSerializer } from '@angular/router';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientModule,

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true }, { provide: UrlSerializer, useClass: LowerCaseUrlSerializer}],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(){
    console.log('App Module Loaded')
  }

 }
