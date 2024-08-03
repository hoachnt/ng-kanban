import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    private isDarkTheme = false;
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        if (this.isBrowser) {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            this.isDarkTheme = prefersDark;
            this.setTheme(this.isDarkTheme);
        }
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        this.setTheme(this.isDarkTheme);
    }

    setTheme(isDark: boolean): void {
        if (this.isBrowser) {
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }

    get theme(): boolean {
        return this.isDarkTheme;
    }
}
