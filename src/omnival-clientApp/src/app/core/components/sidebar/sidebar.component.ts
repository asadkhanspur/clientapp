import { Component, OnInit } from '@angular/core';

// ********* Services Import ********* //
import { BaseComponent } from '../base/base.component';
// ********* Services Import ********* //

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends BaseComponent implements OnInit {

  orderCollapsed = true;
  reportingCollapsed = true;
  paymentCollapsed = true;
  profileCollapsed = true;
  reportCollapsed = true;
  accountCollapsed = true;
  panelCollapsed = true;

  constructor( ) 
  {
    super();
  }

  ngOnInit() {
  }

}
