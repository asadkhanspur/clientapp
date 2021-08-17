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
        redirectTo: 'email-list',
        pathMatch: 'full',
      },

      { path: 'email-list', component: EmailManagementListComponent },
      { path: 'notification-list', component: NotificationListComponent },
    ]
  },

  // {
  //   path: '',
  //   redirectTo: 'email-list',
  //   pathMatch: 'full'
  // },

  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailManagementRoutingModule { }
