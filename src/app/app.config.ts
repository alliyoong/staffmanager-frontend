import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('token');
          },
          allowedDomains: ['localhost:8088'],
          disallowedRoutes: ['/login'],
        },
      })
    )
    // provideJwt({
    //   config: {
    //         tokenGetter: () => {
    //           return localStorage.getItem('token');
    //         },
    //         allowedDomains: ['localhost:8088'],
    //         disallowedRoutes: ['/login'],
    //       },
    // })
  ],
};
