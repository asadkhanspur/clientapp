import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    permissionList = [];
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.permissionList = authenticationService.permissionFunction();
    }



    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const currentUser = this.authenticationService.currentUserValue;
        if (this.permissionList == undefined || this.permissionList == null || this.permissionList.length <= 0) {
            this.permissionList = this.authenticationService.permissionFunction();
        }
        if (route.data.permissionsCode != undefined && route.data.permissionsCode != null && route.data.permissionsCode != '' && this.permissionList[route.data.permissionsCode] != true) {
            this.router.navigate(['/loanlist']);
            return false;
        }

        var path = state.url.substring(1); //route.routeConfig.path;'
        if (currentUser) {
            if (path == "dashboard" || path == "") {
                return true;
            }
            else if (path.startsWith("account") && !path.startsWith("account/changepassword") && !path.startsWith("account/signupsuccess")) {
                this.router.navigate(['/loanlist']);
                return false;
            }
            else if (path.startsWith("wizard") || path.startsWith("account/signupsuccess")) {

                var _user = JSON.parse(localStorage.getItem('currentUser'))
                if (!_user.user.isWizardCompleted) {
                    return true;
                }
                this.router.navigate(['/loanlist']);
                return false;
            }
            else {
                return true;
            }
            return true;
        }

        if (path.startsWith("account")) {
            return true;
        }
        else {
            this.router.navigate(['/account/login']);
        }
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const currentUser = this.authenticationService.currentUserValue;
        if (this.permissionList == undefined || this.permissionList == null || this.permissionList.length <= 0) {
            this.permissionList = this.authenticationService.permissionFunction();
        }
        var path = state.url.substring(1); //route.routeConfig.path;
        if (route.data.permissionsCode != undefined && route.data.permissionsCode != null && route.data.permissionsCode != '' && this.permissionList[route.data.permissionsCode] != true) {
            this.router.navigate(['/loanlist']);
            return false;
        }

        if (currentUser) {

            if (path == "dashboard" || path == "") {
                return true;
            }
            else if (path.startsWith("account") && !path.startsWith("account/changepassword") && !path.startsWith("account/signupsuccess")) {
                this.router.navigate(['/loanlist']);
                return false;
            }
            else if (path.startsWith("wizard") || path.startsWith("account/signupsuccess")) {

                var _user = JSON.parse(localStorage.getItem('currentUser'))
                if (!_user.user.isWizardCompleted) {
                    return true;
                }
                this.router.navigate(['/loanlist']);
                return false;
            }
            else {
                return true;
            }
        }

        if (path.startsWith("account")) {
            return true;
        }
        else {
            this.router.navigate(['/account/login']);
        }
        return false;
    }

}
