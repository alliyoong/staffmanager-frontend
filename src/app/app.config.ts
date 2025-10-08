import { ApplicationConfig, importProvidersFrom, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticationService } from './login/authentication-service';
import { KeycloakAuthInterceptor } from './interceptor/keycloak-auth-interceptor';
import { provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from './config/auth.config';
// import { authInterceptor } from './interceptor/authentication-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAuth(authConfig),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {provide: HTTP_INTERCEPTORS, useClass: KeycloakAuthInterceptor, multi: true},
    // provideHttpClient(
    //   withInterceptors([
    //     (req, next) => new AuthInterceptor(inject(AuthenticationService)).intercept(req, next)
    //   ])
    // ),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('access-token');
          },
          allowedDomains: ['localhost:8088'],
          disallowedRoutes: ['/login'],
        },
      })
    )
  ],
};
