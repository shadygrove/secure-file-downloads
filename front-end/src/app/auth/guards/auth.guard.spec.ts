import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth.service';
import { AuthWithForcedLoginGuard } from './auth-with-forced-login.guard';

import { AcquireAuthGuard } from './auth.guard';

class FakeAuthComponent {}

class FakeAuthService { }

describe('AuthGuard', () => {
  let guard: AcquireAuthGuard;

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
    guard = TestBed.inject(AcquireAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
