import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthModule } from "../auth.module";
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: AuthModule,
})
export class AcquireAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.waitForAuthStatus$().pipe(
      tap((canActivate) => {
        // TODO: Replace with an actual login "fallback" page
        if (!canActivate) {
          this.router.navigate(["404"]);
        }
      })
    );
  }
}
