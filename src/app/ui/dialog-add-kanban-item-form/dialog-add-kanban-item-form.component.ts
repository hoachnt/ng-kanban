import { Component, inject, model } from "@angular/core";
import {
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogTitle,
    MatDialogClose,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IKanbanItem } from "../../libraries/directus/directus";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";

export interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-dialog-add-kanban-item-form",
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
    ],
    templateUrl: "./dialog-add-kanban-item-form.component.html",
    styleUrl: "./dialog-add-kanban-item-form.component.scss",
})
export class DialogAddKanbanItemFormComponent {
    readonly dialogRef = inject(MatDialogRef<DialogAddKanbanItemFormComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly title = model(this.data.title);

    onNoClick(): void {
        this.dialogRef.close();
    }
}
