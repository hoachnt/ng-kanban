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
import { MatExpansionModule } from "@angular/material/expansion";
import { DialogDeleteKanbanListComponent } from "./dialog/dialog-delete-kanban-list/dialog-delete-kanban-list.component";

interface DialogKanbanListData extends IKanbanList {}

import { MatDialog } from "@angular/material/dialog";
import { DialogUpdateKanbanListComponent } from "./dialog/dialog-update-kanban-list/dialog-update-kanban-list.component";
import { DropItemComponent } from "../drop-item/drop-item.component";

@Component({
    selector: "app-drop-list",
    
    imports: [
        CdkDropList,
        DropItemSortPipe,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MatExpansionModule,
        DropItemComponent,
    ],
    templateUrl: "./drop-list.component.html",
    styleUrl: "./drop-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropListComponent {
    @Input() kanbanItems!: IKanbanItem[] | null;
    @Input() kanbanList!: IKanbanList | null;
    @Input() dropListTitle!: string;
    @Input() isUpdating!: Boolean;
    @Input() dropListId!: number | undefined;
    @Output() itemDropped = new EventEmitter<CdkDragDrop<IKanbanItem[]>>();

    readonly dialog = inject(MatDialog);
    readonly panelOpenState = signal(false);

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

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }
}
