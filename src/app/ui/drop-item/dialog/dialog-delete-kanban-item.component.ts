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
import { IKanbanItem, IUser } from "../../../libraries/directus/directus";

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
    readonly me$ = this.kanbanService.me;

    constructor(private _snackBar: MatSnackBar) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onDeleteKanbanItem() {
        if (this.data.id === undefined)
            return this.openSnackBar("Task ID is not found", "error");

        try {
            this.isDeleting.set(true);

            await firstValueFrom(
                this.kanbanService.deleteKanbanItem(this.data.id)
            );

            if (this.me$() === undefined) return;

            await firstValueFrom(
                this.kanbanService.getKanbanItems((this.me$() as IUser).id)
            );

            this.openSnackBar("Successfully deleted!", "success");
        } catch (error) {
            this.openSnackBar("Error during delete task!", "error");
        } finally {
            this.dialogRef.close();
            this.isDeleting.set(false);
        }
    }

    openSnackBar(
        title: string,
        snackbarTypeClass?: "success" | "error" | "warning"
    ) {
        const panelClass = snackbarTypeClass
            ? `${snackbarTypeClass}-snackbar`
            : "";

        this._snackBar.open(title, "Ok", {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 5000,
            panelClass: panelClass ? [panelClass] : undefined,
        });
    }
}
