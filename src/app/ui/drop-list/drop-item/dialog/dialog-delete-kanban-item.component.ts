import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { DialogData } from "../../../dialog-add-kanban-item-form/dialog-add-kanban-item-form.component";
import { KanbanService } from "../../../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";

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

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onDeleteKanbanItem() {
        if (this.data.id === undefined) return;

        this.isDeleting.set(true);

        await firstValueFrom(this.kanbanService.deleteKanbanItem(this.data.id));
        await firstValueFrom(this.kanbanService.getKanbanItems());

        this.dialogRef.close();
        this.isDeleting.set(false);
    }
}
