import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlTemplateRoutingModule } from './html-template-routing.module';
import { HtmlTemplateComponent } from './html-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [HtmlTemplateComponent],
  imports: [
    CommonModule,
    HtmlTemplateRoutingModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatSnackBarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSlideToggleModule,
    TabsModule.forRoot(),
  ]
})
export class HtmlTemplateModule { }
