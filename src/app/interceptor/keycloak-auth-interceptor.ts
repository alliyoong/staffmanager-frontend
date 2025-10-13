import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable()
export class KeycloakAuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: OidcSecurityService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.authService.getAccessToken().subscribe(token => {
        if (token) {
            let header = `Bearer ${token}`;
            let headers = req.headers.set('Authorization', header);
            req = req.clone({ headers });
            return next.handle(req);
        }
        return next.handle(req);
    });
    return next.handle(req);
  }

}
