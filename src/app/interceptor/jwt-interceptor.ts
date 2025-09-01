import { HttpInterceptorFn } from '@angular/common/http';
import { AuthenticationService } from '../login/authentication-service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const baseUrl = authService.baseUrl;
  if (req.url.includes(`${baseUrl}/login`)) {
    return next(req);
  }

  if (req.url.includes(`${baseUrl}/register`)) {
    return next(req);
  }

  // if (req.url.includes(`${baseUrl}`)) {
  //   return next(req);
  // }

  const authToken = authService.getCurrentToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(authReq);
};
