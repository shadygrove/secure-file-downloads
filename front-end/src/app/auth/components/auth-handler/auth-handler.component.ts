import { Component, OnInit } from '@angular/core';
import { OAuthErrorEvent } from 'angular-oauth2-oidc';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: "auth-handler",
  templateUrl: "./auth-handler.component.html",
  styleUrls: ["./auth-handler.component.scss"],
})
export class AuthHandlerComponent implements OnInit {
  isAuthDoneLoading = false;
  isAuthenticated = false;
  authError: OAuthErrorEvent[];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.waitForAuthStatus$().subscribe({
      next: (userHasAuth) => {
        this.isAuthenticated = userHasAuth;
        this.isAuthDoneLoading = true;
      },
      error: (authErr) => {
        this.authError = authErr;
        this.isAuthDoneLoading = true;
      },
    });
  }

  login(): void {
    // Login with redirect back to home
    this.authService.login("/");
  }
}
