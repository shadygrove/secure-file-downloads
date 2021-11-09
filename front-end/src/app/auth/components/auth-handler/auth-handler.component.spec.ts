import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppMaterialModule } from 'src/app/material-module';
import { Spied } from 'src/test-helpers';
import { AuthService } from '../../services/auth.service';

import { AuthHandlerComponent } from './auth-handler.component';

describe('AuthHandlerComponent', () => {
  let component: AuthHandlerComponent;
  let fixture: ComponentFixture<AuthHandlerComponent>;

  const mockAuthService: Spied<AuthService> = jasmine.createSpyObj(
    "mockAuthSvc",
    ["waitForAuthStatus$"]
  );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AppMaterialModule],
        declarations: [AuthHandlerComponent],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
        ],
      }).compileComponents();
    })
  );

  describe('Auth success', () => {
    beforeEach(() => {
      mockAuthService.waitForAuthStatus$.and.returnValue(of(true));

      fixture = TestBed.createComponent(AuthHandlerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(
      'should handle success',
      waitForAsync(() => {
        expect(mockAuthService.waitForAuthStatus$).toHaveBeenCalled();
        expect(component.isAuthDoneLoading).toBeTruthy();
        expect(component.isAuthenticated).toBeTruthy();
      })
    );
  });

  describe('Auth Error', () => {
    beforeEach(() => {
      mockAuthService.waitForAuthStatus$.and.returnValue(throwError(true));

      fixture = TestBed.createComponent(AuthHandlerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it(
      'should handle success',
      waitForAsync(() => {
        expect(mockAuthService.waitForAuthStatus$).toHaveBeenCalled();
        expect(component.isAuthDoneLoading).toBeTruthy();
        expect(component.isAuthenticated).toBeFalsy();
      })
    );
  });
});
