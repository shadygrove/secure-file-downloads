import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { OAuthService, OAuthErrorEvent, UserInfo } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, forkJoin, from, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, tap } from 'rxjs/operators';

import { AuthConfigService } from './auth-config.service';

import { OAuthUserProfile, UserProfile } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@tc/shared';

@Injectable()
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  private isAuthenticatedObs$: Observable<boolean> =
    this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  private isDoneLoadingObs$: Observable<boolean> =
    this.isDoneLoadingSubject$.asObservable();

  private userSubject$ = new Subject<UserProfile>();
  private userObs$: Observable<UserProfile> = this.userSubject$.asObservable();

  private authErrorsSubject$ = new BehaviorSubject<OAuthErrorEvent>(
    null as unknown as OAuthErrorEvent
  );
  private authErrorsObs$: Observable<OAuthErrorEvent> =
    this.authErrorsSubject$.asObservable();

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial login have all been done
   *
   * returns error when there is an OAuth
   */
  public waitForAuthStatus$(): Observable<boolean> {
    // Wait for any loading work to complete; Then evaluate auth status
    return this.isDoneLoading$().pipe(
      filter((isDone) => {
        return isDone;
      }),
      switchMap((_) => {
        // first get the status (it's always set to something)
        // then check for errors, which may or may not exist

        return combineLatest([
          this.isAuthenticated$(),
          this.authErrorsObs$,
        ]).pipe(
          switchMap((data) => {
            if (data[1]) {
              const authError = data[1];
              const reasonMsg = (authError.reason as HttpErrorResponse).message;
              const paramsString = authError.params
                ? Object.keys(authError.params).map(
                    (k) => `${k}=${(authError.params as any)[k]}`
                  )
                : "";
              const msg = `OAuthErrorEvent: ${authError.type} : ${reasonMsg} : ${paramsString}`;
              return throwError(msg);
            }
            return of(data[0]);
          })
        );
      })
    );
  }

  // private navigateToLoginPromptPage() {
  //   // TODO: Remember current URL
  //   this.router.navigateByUrl('/should-login');
  // }

  constructor(
    private authConfig: AuthConfigService,
    private oauthService: OAuthService,
    private router: Router,
    private log: LoggerService
  ) {
    this.oauthService.configure(authConfig.getConfig());
    this.initializeAuthService();
  }

  public getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public user$(): Observable<UserProfile> {
    return this.userObs$;
  }

  public isDoneLoading$(): Observable<boolean> {
    return this.isDoneLoadingObs$;
  }

  public isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedObs$;
  }

  public checkUrl(url: string | null): boolean {
    // if no urls are configured return false
    if (!this.authConfig.getAuthInterceptUrls()) {
      return false;
    }

    const found = this.authConfig
      .getAuthInterceptUrls()
      .find((u: any) => url?.startsWith(u));
    return !!found;
  }

  private initializeAuthService() {
    // Useful for debugging:
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthErrorEvent) {
        this.log.error("OAuthErrorEvent:", event);
        this.authErrorsSubject$.next(event);
      } else {
        this.log.debug("OAuthEvent:", event);
      }
    });

    // TODO: Consider cross-tab implications
    // See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener("storage", (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== "access_token" && event.key !== null) {
        return;
      }

      this.log.log(
        "Noticed changes to access_token (most likely from another tab), updating isAuthenticated"
      );
      const hasValidAuth = this.oauthService.hasValidAccessToken();
      this.isAuthenticatedSubject$.next(hasValidAuth);

      if (!hasValidAuth) {
        this.login();
      }
    });

    this.oauthService.events.subscribe((_) => {
      const validAuth = this.oauthService.hasValidAccessToken();
      this.isAuthenticatedSubject$.next(validAuth);
    });

    this.oauthService.events
      .pipe(filter((e) => ["token_received"].includes(e.type)))
      .subscribe((e) => {
        this.getUserInfo().pipe(
          map((userInfo) => this.userSubject$.next(userInfo))
        );
      });

    this.oauthService.events
      .pipe(
        filter((e) => ["session_terminated", "session_error"].includes(e.type))
      )
      .subscribe((e) => this.login());

    // TODO: enable silent refresh later
    // this.oauthService.setupAutomaticSilentRefresh();
  }

  /*
   * This gets called in the app component and happens any time the application/page is loaded (eg. page refresh)
   */
  public runInitialLoginSequence(): Observable<void> {
    if (location.hash) {
      this.log.debug("Encountered hash fragment", location.hash);
    }

    return this.initLoginAsObservable();
  }

  private getUserInfo(): Observable<UserProfile> {
    const idTokenString = this.oauthService.getIdToken();
    const accessTokenString = this.oauthService.getAccessToken();
    const idToken$ = from(
      this.oauthService.processIdToken(idTokenString, accessTokenString)
    );

    // The Demo ID Server returs following for user profile endpoint
    // {
    //     "name": "Bob Smith",
    //     "given_name": "Bob",
    //     "family_name": "Smith",
    //     "email": "BobSmith@email.com",
    //     "email_verified": true,
    //     "website": "http://bob.com",
    //     "sub": "11"
    // }
    return forkJoin([idToken$, this.oauthService.loadUserProfile()]).pipe(
      map((identity) => {
        const idClaims = identity[0].idTokenClaims;
        const profile = identity[1] as OAuthUserProfile;

        return {
          fullName: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email
        } as UserProfile;
      })
    );
  }

  private initLoginAsObservable(): any {
    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    const discObs = from(this.oauthService.loadDiscoveryDocument());

    return discObs.pipe(
      switchMap(() => {
        // 1. HASH LOGIN:
        // Try to log in via hash fragment after redirect back
        // from IdServer from initImplicitFlow:
        return from(this.oauthService.tryLogin());
      }),
      switchMap(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return this.getUserInfo().pipe(
            switchMap((userInfo) => {
              this.userSubject$.next(userInfo);

              this.isDoneLoadingSubject$.next(true);

              // Check for the strings 'undefined' and 'null' just to be sure. Our current
              // login(...) should never have this, but in case someone ever calls
              // initImplicitFlow(undefined | null) this could happen.
              if (
                this.oauthService.state &&
                this.oauthService.state !== "undefined" &&
                this.oauthService.state !== "null"
              ) {
                let stateUrl = this.oauthService.state;
                if (stateUrl.startsWith("/") === false) {
                  stateUrl = decodeURIComponent(stateUrl);
                }
                this.log.info(
                  `There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`
                );
                this.router.navigateByUrl(stateUrl);
              }

              return of();
            })
          );
        } else {
          const msg = "Auth Error: no valid token found";
          this.log.info(msg);
          return throwError(msg);
        }

        // TODO: Enable silent refresh later
        // // 2. SILENT LOGIN:
        // // Try to log in via a refresh because then we can prevent
        // // needing to redirect the user:
        // return from(this.tryRefreshToken());
      }),
      catchError((err) => {
        this.isDoneLoadingSubject$.next(true);
        return throwError(err);
      })
    );
  }

  public login(targetUrl?: string) {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    this.oauthService.initLoginFlow(targetUrl || this.router.url);
  }

  public logout() {
    this.oauthService.logOut();
  }

  public refresh() {
    this.oauthService.silentRefresh();
  }

  public hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }

  private tryRefreshToken() {
    return this.oauthService
      .silentRefresh()
      .then(() => {
        this.log.info("SILENT REFRESH successful");
        return Promise.resolve();
      })
      .catch((result) => {
        // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
        // Only the ones where it's reasonably sure that sending the
        // user to the IdServer will help.
        const errorResponsesRequiringUserInteraction = [
          "interaction_required",
          "login_required",
          "account_selection_required",
          "consent_required",
        ];

        if (
          result &&
          result.reason &&
          errorResponsesRequiringUserInteraction.indexOf(result.reason.error) >=
            0
        ) {
          // 3. ASK FOR LOGIN:
          // At this point we know for sure that we have to ask the
          // user to log in, so we redirect them to the IdServer to
          // enter credentials.
          //
          // Enable this to ALWAYS force a user to login.
          // this.login();
          //
          // Instead, we'll now do this:
          this.log.log(
            "User interaction is needed to log in, we will wait for the user to manually log in."
          );
          return Promise.resolve();
        }

        // We can't handle the truth, just pass on the problem to the
        // next handler.
        return Promise.reject(result);
      });
  }
}
