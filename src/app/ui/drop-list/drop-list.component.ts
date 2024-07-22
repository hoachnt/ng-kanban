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
    CdkDragPlaceholder,
} from "@angular/cdk/drag-drop";
import { DropItemSortPipe } from "../../helpers/pipes/drop-item-sort.pipe";
import { IKanbanItem, IKanbanList } from "../../libraries/directus/directus";
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
import { DialogDeleteKanbanListComponent } from "./dialog/dialog-delete-kanban-list/dialog-delete-kanban-list.component";
import { MatSnackBar } from "@angular/material/snack-bar";

interface DialogData extends IKanbanItem {}
interface DialogKanbanListData extends IKanbanList {}

@Component({
    selector: "app-drop-list",
    standalone: true,
    imports: [
        CdkDrag,
        CdkDropList,
        CdkDragPlaceholder,
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
    @Input() connectedTo!: string[];
    @Input() isUpdated!: Boolean;
    @Input() dropListId!: number | undefined;
    @Output() itemDropped = new EventEmitter<CdkDragDrop<IKanbanItem[]>>();

    readonly dialog = inject(MatDialog);
    panelOpenState = signal(false);

    private holdTimeout: any;

    constructor(private _snackBar: MatSnackBar) {}

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }

    onMouseDown(event: MouseEvent) {
        this.openSnackBar("Hold for a second to drag");

        this.holdTimeout = setTimeout(() => {
            this.openSnackBar("You can drag it now");
        }, 1000);
    }

    onMouseUp(event: MouseEvent): void {
        clearTimeout(this.holdTimeout);
    }

    openSnackBar(title: string) {
        this._snackBar.open(title, "Ok", {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 5000,
        });
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
    openDialogDeleteKanbanList(kanbanList: DialogKanbanListData | null): void {
        if (kanbanList === null) return;

        const dialogRef = this.dialog.open(DialogDeleteKanbanListComponent, {
            data: { title: kanbanList.title, id: kanbanList.id },
        });

        dialogRef.afterClosed().subscribe();
    }
}
