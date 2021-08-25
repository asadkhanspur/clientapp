import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/components';

@Component({
  selector: 'app-email-management-menu',
  templateUrl: './email-management-menu.component.html',
  styleUrls: ['./email-management-menu.component.css']
})
export class EmailManagementMenuComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
