import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
} from "@angular/core";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { DropItemSortPipe } from "../../helpers/pipes/drop-item-sort.pipe";
import { IKanbanItem } from "../../libraries/directus/directus";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogDeleteKanbanItem } from "./drop-item/dialog/dialog-delete-kanban-item.component";
import { DialogUpdateKanbanItemComponent } from "./drop-item/dialog/dialog-update-kanban-item.component";
import { DatePipe } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { TruncateTextPipe } from "../../helpers/pipes/truncate-text.pipe";

interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-drop-list",
    standalone: true,
    imports: [
        CdkDrag,
        CdkDropList,
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
    @Input() data!: IKanbanItem[] | null;
    @Input() dropListTitle!: string;
    @Input() connectedTo!: string[];
    @Input() isUpdated!: Boolean;
    @Input() dropListId!: number | undefined;
    @Output() itemDropped = new EventEmitter<CdkDragDrop<IKanbanItem[]>>();

    readonly dialog = inject(MatDialog);
    panelOpenState = signal(false);

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }

    openDialog(kanbanItem: DialogData | null): void {
        if (kanbanItem === null) return;

        const dialogRef = this.dialog.open(DialogDeleteKanbanItem, {
            data: { title: kanbanItem.title, id: kanbanItem.id },
        });

        dialogRef.afterClosed().subscribe();
    }
    openDialogUpdate(kanbanItem: DialogData | null) {
        if (kanbanItem === null) return;

        const dialogRef = this.dialog.open(DialogUpdateKanbanItemComponent, {
            data: {
                title: kanbanItem.title,
                description: kanbanItem.description,
                id: kanbanItem.id,
                deadline: kanbanItem.deadline,
                kanban_list_id: kanbanItem.kanban_list_id,
                currentIndex: kanbanItem.currentIndex,
            },
        });

        dialogRef.afterClosed().subscribe();
    }
}
