import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    private isDarkTheme = false;

    constructor() {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        this.isDarkTheme = prefersDark;
        this.setTheme(this.isDarkTheme);
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        this.setTheme(this.isDarkTheme);
    }

    setTheme(isDark: boolean): void {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    get theme(): boolean {
        return this.isDarkTheme;
    }
}
