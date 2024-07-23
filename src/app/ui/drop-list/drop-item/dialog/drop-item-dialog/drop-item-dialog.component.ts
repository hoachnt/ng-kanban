import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogDeleteKanbanItem } from "../dialog-delete-kanban-item.component";
import { DialogUpdateKanbanItemComponent } from "../dialog-update-kanban-item.component";
import {
    IKanbanItem,
    IKanbanList,
} from "../../../../../libraries/directus/directus";

interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-drop-item-dialog",
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        DatePipe,
    ],
    templateUrl: "./drop-item-dialog.component.html",
    styleUrl: "./drop-item-dialog.component.scss",
})
export class DropItemDialogComponent {
    readonly dialog = inject(MatDialog);
    readonly dialogRef = inject(MatDialogRef<DropItemDialogComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);

    openDialogDelete(kanbanItem: DialogData | null): void {
        if (kanbanItem === null) return;

        const dialogDeleteRef = this.dialog.open(DialogDeleteKanbanItem, {
            data: { title: kanbanItem.title, id: kanbanItem.id },
        });

        dialogDeleteRef.afterClosed().subscribe();
        this.dialogRef.close();
    }
    openDialogUpdate(kanbanItem: DialogData | null) {
        if (kanbanItem === null) return;

        const dialogUpdateRef = this.dialog.open(
            DialogUpdateKanbanItemComponent,
            {
                data: {
                    title: kanbanItem.title,
                    description: kanbanItem.description,
                    id: kanbanItem.id,
                    deadline: kanbanItem.deadline,
                    kanban_list_id: kanbanItem.kanban_list_id,
                    currentIndex: kanbanItem.currentIndex,
                },
            }
        );

        dialogUpdateRef.afterClosed().subscribe();
        this.dialogRef.close();
    }
}
