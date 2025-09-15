import { ApplicationConfig, importProvidersFrom, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/authentication-interceptor';
import { AuthenticationService } from './login/authentication-service';
// import { authInterceptor } from './interceptor/authentication-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
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
