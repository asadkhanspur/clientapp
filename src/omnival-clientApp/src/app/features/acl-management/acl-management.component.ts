import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/components';


@Component({
  selector: 'app-acl-management',
  templateUrl: './acl-management.component.html',
  styleUrls: ['./acl-management.component.css']
})
export class AclManagementComponent extends BaseComponent  implements OnInit {

    constructor(
    ) {
      super();
     
     }

    ngOnInit() {
     
    }
}