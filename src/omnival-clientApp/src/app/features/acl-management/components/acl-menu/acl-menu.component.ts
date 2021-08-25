import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../core/components';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-acl-menu',
  templateUrl: './acl-menu.component.html',
  styleUrls: ['./acl-menu.component.css']
})
export class AclMenuComponent extends BaseComponent  implements OnInit {

    constructor(
      private router: Router,
      private route: ActivatedRoute,
    ) {
      super();
     }

    ngOnInit() {
      if(this.router.url === "/acl-management/roles"){
          if (!this.permissions.RMRV) {
            this.router.navigateByUrl('/acl-management/users');
          }
      }
    }

}
