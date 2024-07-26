import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";

import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { KanbanService } from "../../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import { IKanbanItem } from "../../../libraries/directus/directus";

export interface DialogData extends IKanbanItem {}

@Component({
    selector: "dialog-delete-kanban-item",
    templateUrl: "dialog-delete-kanban-item.component.html",
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
    ],
})
export class DialogDeleteKanbanItem {
    readonly dialogRef = inject(MatDialogRef<DialogDeleteKanbanItem>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);

    readonly kanbanService = inject(KanbanService);
    readonly isDeleting = signal(false);

    constructor(private _snackBar: MatSnackBar) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onDeleteKanbanItem() {
        if (this.data.id === undefined) return;

        this.isDeleting.set(true);

        try {
            await firstValueFrom(
                this.kanbanService.deleteKanbanItem(this.data.id)
            );
            await firstValueFrom(this.kanbanService.getKanbanItems());

            this.openSnackBar("Successfully deleted!");
        } catch (error) {
            this.openSnackBar("Error during delete task!");
        } finally {
            this.dialogRef.close();
            this.isDeleting.set(false);
        }
    }

    openSnackBar(title: string) {
        this._snackBar.open(title, "Ok", {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 5000,
        });
    }
}
