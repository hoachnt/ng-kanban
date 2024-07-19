import {
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import {
    catchError,
    switchMap,
    throwError,
    BehaviorSubject,
    filter,
    take,
} from "rxjs";

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
>(null);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token;

    if (token) {
        req = addToken(req, token);
    }

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 403 || error.status === 401) {
                return handle403Error(req, next, authService);
            } else {
                return throwError(() => error);
            }
        })
    );
};

const handle403Error = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService
) => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshAuthToken().pipe(
            switchMap((res) => {
                isRefreshing = false;
                refreshTokenSubject.next(res.data.access_token);
                return next(addToken(req, res.data.access_token));
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((token) => {
                return next(addToken(req, token!));
            })
        );
    }
};

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
};
