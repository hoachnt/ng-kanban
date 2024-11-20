import { CdkDrag, CdkDragHandle, CdkDropList } from "@angular/cdk/drag-drop";
import { Component, inject, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { IKanbanItem } from "../../libraries/directus/directus";
import { TruncateTextPipe } from "../../helpers/pipes/truncate-text.pipe";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { DropItemDialogComponent } from "./dialog/drop-item-dialog/drop-item-dialog.component";

@Component({
    selector: "app-drop-item",
    
    imports: [
        CdkDrag,
        CdkDragHandle,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        TruncateTextPipe,
        DatePipe,
    ],
    templateUrl: "./drop-item.component.html",
    styleUrl: "./drop-item.component.scss",
})
export class DropItemComponent {
    @Input() item!: IKanbanItem;
    @Input() isUpdating!: Boolean;

    readonly dialog = inject(MatDialog);

    openDropItemDialog(kanbanItem: IKanbanItem | null): void {
        if (kanbanItem === null) return;

        const dialogRef = this.dialog.open(DropItemDialogComponent, {
            data: {
                ...kanbanItem,
            },
        });

        dialogRef.afterClosed().subscribe();
    }
}
