import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductManagmentRoutingModule } from './product-managment-routing.module';
import { ProductManagmentComponent } from './product-managment.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [ProductManagmentComponent],
  imports: [
    CommonModule,
    ProductManagmentRoutingModule,
    MatSlideToggleModule,
    MatSliderModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BsDropdownModule
  ]
})
export class ProductManagmentModule { }
