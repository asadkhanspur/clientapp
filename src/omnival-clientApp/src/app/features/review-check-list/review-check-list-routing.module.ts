import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewCheckListComponent } from './review-check-list.component';

const routes: Routes = [
  { path: '', component: ReviewCheckListComponent },
  { path: '', component: ReviewCheckListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewCheckListRoutingModule { }
