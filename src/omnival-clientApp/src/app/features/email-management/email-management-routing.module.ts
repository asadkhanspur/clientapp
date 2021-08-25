import { NotificationListComponent, EmailManagementListComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailManagementComponent } from './email-management.component';

const routes: Routes = [
  {
    path: '', component: EmailManagementComponent,
    children: [

      {
        path: '',
        redirectTo: 'emails',
        pathMatch: 'full',
      },

      { path: 'emails', component: EmailManagementListComponent },
      { path: 'notifications', component: NotificationListComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailManagementRoutingModule { }
