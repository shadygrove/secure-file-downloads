import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth.service';

import { AuthWithForcedLoginGuard } from './auth-with-forced-login.guard';
import { AcquireAuthGuard } from './auth.guard';

class FakeAuthComponent {}

class FakeAuthService { }

describe('AuthWithForcedLoginGuard', () => {
  let guard: AuthWithForcedLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "should-login", component: FakeAuthComponent },
        ]),
      ],
      providers: [
        AuthService,
        { provide: OAuthService, useClass: FakeAuthService },
        { provide: AuthWithForcedLoginGuard, useValue: {} },
        { provide: AcquireAuthGuard, useValue: {} },
      ],
    });
    guard = TestBed.inject(AuthWithForcedLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
