import { Component } from "@angular/core";
import { DropListGroupComponent } from "../../ui/drop-list-group/drop-list-group.component";

@Component({
    selector: "app-home-page",
    standalone: true,
    imports: [DropListGroupComponent],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
})
export class HomePageComponent {}
