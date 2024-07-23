import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
} from "@angular/core";
import {
    CdkDragDrop,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
} from "@angular/cdk/drag-drop";
import { DropItemSortPipe } from "../../helpers/pipes/drop-item-sort.pipe";
import { IKanbanItem, IKanbanList } from "../../libraries/directus/directus";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DatePipe } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { TruncateTextPipe } from "../../helpers/pipes/truncate-text.pipe";
import { DialogDeleteKanbanListComponent } from "./dialog/dialog-delete-kanban-list/dialog-delete-kanban-list.component";

interface DialogKanbanListData extends IKanbanList {}

import { MatDialog } from "@angular/material/dialog";
import { DropItemDialogComponent } from "./drop-item/dialog/drop-item-dialog/drop-item-dialog.component";
import { DialogUpdateKanbanListComponent } from "./dialog/dialog-update-kanban-list/dialog-update-kanban-list.component";

@Component({
    selector: "app-drop-list",
    standalone: true,
    imports: [
        CdkDrag,
        CdkDropList,
        CdkDragHandle,
        DropItemSortPipe,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        DatePipe,
        TruncateTextPipe,
        MatExpansionModule,
    ],
    templateUrl: "./drop-list.component.html",
    styleUrl: "./drop-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropListComponent {
    @Input() kanbanItems!: IKanbanItem[] | null;
    @Input() kanbanList!: IKanbanList | null;
    @Input() dropListTitle!: string;
    @Input() isUpdated!: Boolean;
    @Input() dropListId!: number | undefined;
    @Output() itemDropped = new EventEmitter<CdkDragDrop<IKanbanItem[]>>();

    readonly dialog = inject(MatDialog);

    openDialogDeleteKanbanList(kanbanList: DialogKanbanListData | null): void {
        if (kanbanList === null) return;

        const dialogRef = this.dialog.open(DialogDeleteKanbanListComponent, {
            data: { title: kanbanList.title, id: kanbanList.id },
        });

        dialogRef.afterClosed().subscribe();
    }

    openDialogUpdateKanbanList(kanbanList: DialogKanbanListData | null): void {
        if (kanbanList === null) return;

        const dialogRef = this.dialog.open(DialogUpdateKanbanListComponent, {
            data: { ...kanbanList },
        });

        dialogRef.afterClosed().subscribe();
    }

    openDropItemDialog(kanbanItem: IKanbanItem | null): void {
        if (kanbanItem === null) return;

        const dialogRef = this.dialog.open(DropItemDialogComponent, {
            data: {
                ...kanbanItem,
            },
        });

        dialogRef.afterClosed().subscribe();
    }

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }
}
