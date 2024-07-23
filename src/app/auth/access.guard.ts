import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export function canActivateAuth() {
    const isLoggedIn = inject(AuthService).isAuth;

    if (isLoggedIn) {
        return true;
    }

    return inject(Router).createUrlTree(["/login"]);
}

export function canActivateLogin() {
    const isLoggedIn = inject(AuthService).isAuth;

    if (!isLoggedIn) {
        return true;
    }

    return inject(Router).createUrlTree(["/"]);
}
