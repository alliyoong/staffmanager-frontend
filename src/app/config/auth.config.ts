import { PassedInitialConfig } from "angular-auth-oidc-client";

export const authConfig: PassedInitialConfig = {
    config: {
        authority: "http://localhost:8088/realms/hrmaz-realm",
        clientId: "hrmaz-angular-client-id",
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        responseType: "code",
        scope: "openid profile offline_access",
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        customParamsAuthRequest: {
            prompt: "login"
        }
    }
}