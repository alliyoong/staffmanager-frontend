import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../login/authentication-service';
import { NotificationService } from '../notification/notification-service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const notiService = inject(NotificationService);

  // if (authService.isLoggedIn()) {
  //   return true;
  // } else {
  //   notiService.show("Please login first", 'warning');
  //   router.navigate([`/login`]);
  //   return false;
  // }

  return true;
};
