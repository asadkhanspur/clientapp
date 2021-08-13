
// ********* Module Import ********* //
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountRoutingModule } from './account-routing.module';
// import { NgxMaskModule } from 'ngx-mask';
// import { ShowHidePasswordModule } from 'ngx-show-hide-password';
// ********* Module Import ********* //


import { SignupComponent, LoginComponent } from './components';
import { AccountComponent } from './account.component';


@NgModule({
  declarations: [AccountComponent, SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CarouselModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    ModalModule.forRoot(),
        // ShowHidePasswordModule,
    // NgxMaskModule.forRoot(),
  ]
})
export class AccountModule {
  constructor() {
    console.log('Account Module Loaded')
  }
}
