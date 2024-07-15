import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { DropItemSortPipe } from "../../helpers/pipes/drop-item-sort.pipe";
import { IKanbanItem } from "../../libraries/directus/directus";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";

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
})
export class DropListComponent {
    @Input() data!: IKanbanItem[] | null;
    @Input() dropListTitle!: string;
    @Input() connectedTo!: string[];
    @Input() isUpdated!: Boolean;
    @Input() dropListId!: number | undefined;
    @Output() itemDropped = new EventEmitter<CdkDragDrop<IKanbanItem[]>>();

    kanbanService = inject(KanbanService);

    isDisabled = true;

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }

    async onDeleteKanbanItem(kanbanId: number | undefined) {
        if (kanbanId === undefined) return;

        await firstValueFrom(this.kanbanService.deleteKanbanItem(kanbanId));
        await firstValueFrom(this.kanbanService.getKanbanItems());
    }
}
