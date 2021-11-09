import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';

import { OAuthModuleConfig, OAuthResourceServerErrorHandler, OAuthStorage } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { AuthConfigService } from './auth-config.service';

@Injectable()
export class OidcAuthInterceptorService implements HttpInterceptor {
  constructor(private authConfig: AuthConfigService, private authStorage: OAuthStorage) {}

  private checkUrl(url: string): boolean {
    const found = this.authConfig
      .getAuthInterceptUrls()
      .find((u) => url.startsWith(u));
    return !!found;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();

    if (!this.authConfig.getAuthInterceptUrls()) {
      return next.handle(req);
    }
    if (!this.checkUrl(url)) { return next.handle(req); }

    const sendAccessToken = this.authConfig.getAuthInterceptEnabled();

    if (sendAccessToken) {
      const token = this.authStorage.getItem('access_token');
      const authBearerHeader = 'Bearer ' + token;

      // Use "clone and set" method described in Angular Docs
      // https://angular.io/guide/http#handling-interceptor-events
      //
      // The set() function creates a clone, sets the value, and returns the clone
      // It does not modify the original object
      const headers = req.headers.set('Authorization', authBearerHeader);

      req = req.clone({ headers });
    }

    return next.handle(req);
  }
}
