import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { DialogAddKanbanItemFormComponent } from "../dialog-add-kanban-item-form/dialog-add-kanban-item-form.component";

@Component({
    selector: "app-add-kanban-item-dialog",
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
    ],
    templateUrl: "./add-kanban-item-dialog.component.html",
    styleUrl: "./add-kanban-item-dialog.component.scss",
})
export class AddKanbanItemDialogComponent {
    readonly title = signal("");
    readonly dialog = inject(MatDialog);

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogAddKanbanItemFormComponent, {
            data: { title: this.title() },
        });

        dialogRef.afterClosed().subscribe();
    }
}
