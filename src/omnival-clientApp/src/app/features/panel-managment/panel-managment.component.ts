import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-panel-managment',
  templateUrl: './panel-managment.component.html',
  styleUrls: ['./panel-managment.component.css']
})
export class PanelManagmentComponent implements OnInit {
  tabListSource;

  ngOnInit(): void { }

  constructor(
              private route: Router) {
    this.tabListSource = [
      { href: 'currentVendors', title: "Current Vendors" },
      { href: 'availableVendors', title: "Recruit Vendors" },
      { href: 'pendingVendors', title: "Pending Vendors" },
    ];
    this.route.navigate(['panel-managment/currentVendors']);
  }
}
