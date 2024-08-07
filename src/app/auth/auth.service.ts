import { SsrCookieService } from "ngx-cookie-service-ssr";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ITokenResponse } from "./auth.type";
import { environment } from "../../environments/environment";
import { IDirectusLoginData } from "../libraries/directus/directus";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    http = inject(HttpClient);
    cookieService = inject(SsrCookieService);
    router = inject(Router);

    baseAuthUrl: string = `${environment.directusUrl}/auth`;
    baseUserUrl: string = `${environment.directusUrl}/users`;
    mainDomain: string = `${environment.mainDomain}`;
    token: string | null = null;
    refreshToken: string | null = null;

    get isAuth() {
        if (!this.token) {
            this.token = this.cookieService.get("token");
            this.refreshToken = this.cookieService.get("refreshToken");
        }

        return !!this.token;
    }

    login(payload: { email: string; password: string }) {
        return this.http
            .post<IDirectusLoginData>(`${this.baseAuthUrl}/login`, payload)
            .pipe(
                tap((res) => {
                    this.saveTokens(res.data);
                })
            );
    }

    register(payload: {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
    }) {
        return this.http.post<IDirectusLoginData>(`${this.baseUserUrl}`, {
            ...payload,
            role: environment.userRole,
        });
    }

    refreshAuthToken() {
        return this.http
            .post<IDirectusLoginData>(`${this.baseAuthUrl}/refresh`, {
                refresh_token: this.refreshToken,
            })
            .pipe(
                tap((res) => {
                    this.saveTokens(res.data);
                }),
                catchError((err) => {
                    this.logout();

                    return throwError(err);
                })
            );
    }

    logout() {
        this.cookieService.deleteAll("/", this.mainDomain, true, "Lax");
        this.token = null;
        this.refreshToken = null;
        this.router.navigate(["/auth/login"]);
    }
    saveTokens(res: ITokenResponse) {
        this.token = res.access_token;
        this.refreshToken = res.refresh_token;
        this.cookieService.set(
            "token",
            this.token,
            undefined,
            "/",
            this.mainDomain,
            true,
            "Lax"
        );
        this.cookieService.set(
            "refreshToken",
            this.refreshToken,
            undefined,
            "/",
            this.mainDomain,
            true,
            "Lax"
        );
    }
}
