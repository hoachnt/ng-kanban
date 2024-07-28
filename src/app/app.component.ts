import { Component, ViewEncapsulation } from "@angular/core";
import { ChildrenOutletContexts, RouterOutlet } from "@angular/router";
import { slideInAnimation } from "./app.animations";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    animations: [slideInAnimation],
    encapsulation: ViewEncapsulation.None, // Add this line
})
export class AppComponent {
    title = "kanban";

    constructor(private contexts: ChildrenOutletContexts) {}

    getRouteAnimationData() {
        return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
            "animation"
        ];
    }
}
