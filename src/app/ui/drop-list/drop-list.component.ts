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
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";

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

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }

    openDialog(kanbanItem: DialogData): void {
        if (this.data === null) return;

        const dialogRef = this.dialog.open(DialogDeleteKanbanItem, {
            data: { title: kanbanItem.title, id: kanbanItem.id },
        });

        dialogRef.afterClosed().subscribe();
    }
}

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
