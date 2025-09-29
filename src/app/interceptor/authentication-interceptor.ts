import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from '../login/authentication-service';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { NotificationService } from '../notification/notification-service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private baseUrl = '';

  constructor(
    private authService: AuthenticationService,
    private notiService: NotificationService,
    private router: Router
  ) {
    this.baseUrl = authService.baseUrl;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes(`${this.baseUrl}/login`)) {
      return next.handle(req);
    }

    // if (req.url.includes(`${this.baseUrl}/register`)) {
    //   return next.handle(req);
    // }

    const accessToken = this.authService.getCurrentToken();
    if (accessToken) {
      req = this.addToken(req, accessToken);
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          const token = response.body.data;
          this.authService.setCurrentToken(token);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // If refresh fails, logout the user
          this.authService.logOut();
          this.authService.clearLocalStorage();
          this.notiService.show('You have to re-login', 'warning');
          this.router.navigate(['/']);
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
