import { Component } from "@angular/core";
import {
    ChildrenOutletContexts,
    RouterLink,
    RouterOutlet,
} from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { slideInAnimation } from "./auth-layout.animations";

@Component({
    selector: "app-auth-layout",
    standalone: true,
    imports: [RouterOutlet, RouterLink, MatTabsModule, MatButtonModule],
    templateUrl: "./auth-layout.component.html",
    styleUrl: "./auth-layout.component.scss",
    animations: [slideInAnimation],
})
export class AuthLayoutComponent {
    constructor(private contexts: ChildrenOutletContexts) {}
    getRouteAnimationData() {
        return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
            "animation"
        ];
    }
}
