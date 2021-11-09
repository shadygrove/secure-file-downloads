import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';

@Injectable()
export class AuthConfigService {
  private enableAuthIntercept = false;

  private baseAuthConfig: AuthConfig = {
    // TODO: Enable HTTPS for Keycloak server.  Temporarily disabled to support local UI development
    // clientId: 'local-angular-demo-client', // The "Auth Code + PKCE" client
    responseType: "code",
    requireHttps: false, // only false for local
    redirectUri: window.location.origin + "/auth-handler",
    silentRefreshRedirectUri: window.location.origin + "/silent-refresh.html",
    // scope: 'openid profile email acquire_all_attributes acquire_main_api_aud', // offline_access for token refreshes
    useSilentRefresh: false, // Needed for Code Flow to suggest using iframe-based refreshes
    silentRefreshTimeout: 5000, // For faster testing
    // timeoutFactor: 0.25, // For faster testing
    sessionChecksEnabled: false,
    showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
    // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
    clearHashAfterLogin: false,
    nonceStateSeparator: "semicolon", // Real semicolon gets mangled by IdentityServer's URI encoding
    strictDiscoveryDocumentValidation: false,
  };

  constructor() {
    this.baseAuthConfig.issuer = "https://demo.identityserver.io";
    this.baseAuthConfig.clientId = "interactive.public";
    this.baseAuthConfig.scope = "openid profile email api offline_access";
  }

  getConfig() {
    return this.baseAuthConfig;
  }

  getAuthInterceptUrls(): string[] {
    return ["http://localhost:5000/", "https://demo.identityserver.io/api/"];
  }

  getAuthInterceptEnabled(): boolean {
    return this.enableAuthIntercept;
  }

  setAuthInterceptEnabled(enable: boolean) {
    this.enableAuthIntercept = enable;
  }
}
