import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent
} from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from "../services";
import { Router } from "@angular/router";

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // // add custom header
        // const customReq = request.clone({
        //   headers: request.headers.set("app-author", "Dzhavat")
        // });
        // console.log("processing request", customReq);

        // pass on the modified request object
        return next
            .handle(request)
            .pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        //console.log('event--->>>', event);
                    }
                    return event;
                })
                ,
                catchError((error: HttpErrorResponse) => {
                    if (error.error.message == "Missing Token" || error.error.message == "Invalid Token" || error.error.message == "Token has been expired") {
                        // remove user from local storage to log user out
                        this.authenticationService.logout();
                        this.router.navigate(['/account/login']);
                    }
                    else {
                        //console.log('event--->>>', error);
                        return throwError(error);
                    }
                }));
    }
}
