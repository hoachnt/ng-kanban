import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AddKanbanItemDialogComponent } from "../../add-kanban-item-dialog/add-kanban-item-dialog.component";

@Component({
    selector: "app-toolbar",
    standalone: true,
    imports: [
        AddKanbanItemDialogComponent,
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: "./toolbar.component.html",
    styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {}
