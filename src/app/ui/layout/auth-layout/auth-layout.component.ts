import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-auth-layout",
    standalone: true,
    imports: [RouterOutlet, RouterLink, MatTabsModule, MatButtonModule],
    templateUrl: "./auth-layout.component.html",
    styleUrl: "./auth-layout.component.scss",
})
export class AuthLayoutComponent {}
