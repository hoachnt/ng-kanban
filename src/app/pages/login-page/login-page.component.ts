import { firstValueFrom } from "rxjs";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../auth/auth.service";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: "app-login-page",
    
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: "./login-page.component.html",
    styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent {
    fb = inject(FormBuilder);
    authService = inject(AuthService);
    router = inject(Router);

    form = this.fb.group({
        email: ["", Validators.required],
        password: ["", Validators.required],
    });

    hide = signal(true);
    isDisabling = signal(false);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    async onSubmit() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) return;

        try {
            this.isDisabling.set(true);

            //@ts-ignore
            await firstValueFrom(this.authService.login(this.form.value));
            this.router.navigate([""]);
        } catch (error) {
            console.error(error);
        } finally {
            this.isDisabling.set(false);
        }
    }
}
