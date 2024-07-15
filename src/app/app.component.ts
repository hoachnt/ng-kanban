import { Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    encapsulation: ViewEncapsulation.None, // Add this line
})
export class AppComponent {
    title = "kanban";
}
