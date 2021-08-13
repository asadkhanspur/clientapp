import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


// ********* Services Import ********* //
import { AuthenticationService } from '../../../core/services';
// ********* Services Import ********* //

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private AuthenticationService : AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }


  logOutUser(){
    this.AuthenticationService.logout()
    this.router.navigate(['account/login']);
  }

}
