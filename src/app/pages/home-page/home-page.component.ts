import { Component } from "@angular/core";
import { DropListGroupComponent } from "../../ui/drop-list-group/drop-list-group.component";
import { AddKanbanItemDialogComponent } from "../../ui/add-kanban-item-dialog/add-kanban-item-dialog.component";

@Component({
    selector: "app-home-page",
    standalone: true,
    imports: [DropListGroupComponent, AddKanbanItemDialogComponent],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
})
export class HomePageComponent {}
