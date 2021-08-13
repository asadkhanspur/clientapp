import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { finalize, tap } from 'rxjs/operators';

// ********* Services Import ********* //
import { AuthenticationService } from "../../../core/services"
// ********* Services Import ********* //

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  orderCollapsed = true;
  reportingCollapsed = true;
  paymentCollapsed = true;
  profileCollapsed = true;
  reportCollapsed = true;
  accountCollapsed = true;
  panelCollapsed = true;
  setting: any;
  permissions: any;

  constructor(
    private AuthenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.permissions = this.AuthenticationService.permissionFunction();
  }

}
