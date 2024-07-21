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
import { KanbanService } from "../../../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import { IKanbanList } from "../../../../libraries/directus/directus";

interface DialogData extends IKanbanList {}

@Component({
    selector: "app-dialog-delete-kanban-list",
    standalone: true,
    imports: [
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatButtonModule,
    ],
    templateUrl: "./dialog-delete-kanban-list.component.html",
    styleUrl: "./dialog-delete-kanban-list.component.scss",
})
export class DialogDeleteKanbanListComponent {
    readonly dialogRef = inject(MatDialogRef<DialogDeleteKanbanListComponent>);
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
                this.kanbanService.deleteKanbanList(this.data.id)
            );
            await firstValueFrom(this.kanbanService.getKanbanList());

            this.openSnackBar("Successfully deleted!");
        } catch (error) {
            this.openSnackBar("Error during delete list!");
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
