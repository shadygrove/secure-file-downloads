import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

/*
 *  Watches HTTP Responses for 401 Unauthorized errors
 *  Redirects to login
 *
 *
 */

@Injectable({
  providedIn: 'root'
})
export class AuthErrorInterceptorService implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        // Check if the request is one that we actually send a token to
        const urlRequiresAuth = this.authSvc.checkUrl(e.url);
        if (!urlRequiresAuth) { return throwError(e); }

        // if we got this far, let's handle the error

        // If it was a 401 Auth Error
        // Log the user out (to make sure all browser data is reset)
        // This will also log them out of the Keycloak server and redirect to the Auth Handler screen/component
        if (e.status === 401) {
          this.authSvc.logout();
        }

        return throwError(e);
      })
    );
  }
}
