
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewCheckListComponent } from './review-check-list.component';
import { ReviewListComponent } from './components';

const routes: Routes = [
  //{ path: '', component: ReviewCheckListComponent },

  {
    path: '',
    redirectTo: 'review-list',
    pathMatch: 'full'
  },

  { path: 'review-list', component: ReviewListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewCheckListRoutingModule { }
