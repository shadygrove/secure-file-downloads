import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { AuthModule } from "../auth.module";
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: AuthModule,
})
export class AuthWithForcedLoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.waitForAuthStatus$().pipe(
      tap((canActivate) => {
        console.log("AuthWithForcedLoginGuard", canActivate);

        if (!canActivate) {
          this.authService.login(state.url);
        }
      })
    );
  }
}
