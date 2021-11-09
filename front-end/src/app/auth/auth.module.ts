import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { OAuthModule, OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { OidcAuthInterceptorService } from './services/oidc-auth-interceptor.service';
import { AuthHandlerComponent } from './components/auth-handler/auth-handler.component';
import { AuthService } from './services/auth.service';
import { AuthConfigService } from './services/auth-config.service';
import { AuthErrorInterceptorService } from './services/auth-error-interceptor.service';
import { AppMaterialModule } from '../material-module';

// We need a factory since localStorage is not available at AOT build time
function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  declarations: [AuthHandlerComponent],
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
    RouterModule,
    AppMaterialModule,
  ],
  exports: [AuthHandlerComponent],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: OAuthStorage,
          useFactory: storageFactory,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: OidcAuthInterceptorService,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthErrorInterceptorService,
          multi: true,
        },
        AuthService,
        AuthConfigService,
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        "AuthModule is already loaded. Import it in the AppModule only"
      );
    }
  }
}
