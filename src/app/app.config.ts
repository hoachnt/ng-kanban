import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
    MAT_DATE_LOCALE,
    provideNativeDateAdapter,
} from "@angular/material/core";
import { authTokenInterceptor } from "./auth/auth.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideAnimationsAsync(),
        provideNativeDateAdapter(),

        { provide: MAT_DATE_LOCALE, useValue: "vi-VN" },
    ],
};
