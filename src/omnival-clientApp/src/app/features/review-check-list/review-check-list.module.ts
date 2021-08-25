import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewCheckListRoutingModule } from './review-check-list-routing.module';
import { ReviewCheckListComponent } from './review-check-list.component';


@NgModule({
  declarations: [ReviewCheckListComponent],
  imports: [
    CommonModule,
    ReviewCheckListRoutingModule
  ]
})
export class ReviewCheckListModule { }
