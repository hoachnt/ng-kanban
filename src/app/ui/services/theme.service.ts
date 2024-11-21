import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    private isDarkTheme = false;
    private readonly storageKey = "theme"; // Ключ для хранения темы в localStorage
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        if (this.isBrowser) {
            // Чтение темы из localStorage, если она сохранена
            const savedTheme = localStorage.getItem(this.storageKey);

            if (savedTheme !== null) {
                this.isDarkTheme = savedTheme === "dark";
            } else {
                // Определяем предпочтения пользователя по умолчанию
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;
                this.isDarkTheme = prefersDark;
            }

            this.setTheme(this.isDarkTheme);
        }
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        this.setTheme(this.isDarkTheme);
    }

    setTheme(isDark: boolean): void {
        if (this.isBrowser) {
            const theme = isDark ? "dark" : "light";

            // Устанавливаем стиль темы
            document.documentElement.style.colorScheme = theme;

            // Сохраняем выбранную тему в localStorage
            localStorage.setItem(this.storageKey, theme);
        }
    }

    get theme(): boolean {
        return this.isDarkTheme;
    }
}
