import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ITokenResponse } from "./auth.type";
import { environment } from "../../environments/environment.development";
import {
    IDirectusData,
    IDirectusLoginData,
} from "../libraries/directus/directus";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    http = inject(HttpClient);
    cookieService = inject(CookieService);
    router = inject(Router);

    baseUrl: string = `${environment.directusUrl}/auth`;
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
            .post<IDirectusLoginData>(`${this.baseUrl}/login`, payload)
            .pipe(
                tap((res) => {
                    this.saveTokens(res.data);
                })
            );
    }

    refreshAuthToken() {
        return this.http
            .post<IDirectusLoginData>(`${this.baseUrl}/refresh`, {
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
        this.cookieService.deleteAll();
        this.token = null;
        this.refreshToken = null;
        this.router.navigate(["/login"]);
    }
    saveTokens(res: ITokenResponse) {
        this.token = res.access_token;
        this.refreshToken = res.refresh_token;

        this.cookieService.set("token", this.token);
        this.cookieService.set("refreshToken", this.refreshToken);
    }
}
