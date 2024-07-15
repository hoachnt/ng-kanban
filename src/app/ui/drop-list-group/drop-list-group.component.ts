import { Component, inject, signal } from "@angular/core";
import {
    CdkDragDrop,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from "@angular/cdk/drag-drop";
import { DropListComponent } from "../drop-list/drop-list.component";
import { firstValueFrom } from "rxjs";
import { KanbanService } from "../../data/services/kanban.service";
import { IKanbanItem, IKanbanList } from "../../libraries/directus/directus";
import { KanbanItemsFilterPipe } from "../../helpers/pipes/kanban-items-filter.pipe";

@Component({
    selector: "app-drop-list-group",
    standalone: true,
    imports: [
        DropListComponent,
        CdkDropListGroup,
        CdkDropList,
        KanbanItemsFilterPipe,
    ],
    templateUrl: "./drop-list-group.component.html",
    styleUrls: ["./drop-list-group.component.scss"], // Исправлено styleUrl на styleUrls
})
export class DropListGroupComponent {
    kanbanService = inject(KanbanService);
    kanbanLists = this.kanbanService.kanbanLists;
    kanbanItems = this.kanbanService.kanbanItems;
    isUpdated = signal(false);

    async ngOnInit(): Promise<void> {
        await firstValueFrom(this.kanbanService.getKanbanList());
        await firstValueFrom(this.kanbanService.getKanbanItems());
    }

    async updateKanbanList(data: IKanbanItem[], dropListId?: number) {
        const updatedItems = data.map((kanbanItem: IKanbanItem, index) => ({
            ...kanbanItem,
            currentIndex: index,
            ...(dropListId !== undefined && { kanban_list_id: dropListId }),
        }));

        for (const kanbanItem of updatedItems) {
            if (!kanbanItem.id) continue;

            try {
                await firstValueFrom(
                    this.kanbanService.updateKanbanItems(
                        kanbanItem.id,
                        kanbanItem
                    )
                );
            } catch (error) {
                console.error("Error when updating kanban item:", error);
            }
        }

        await firstValueFrom(this.kanbanService.getKanbanItems());
    }

    async drop(event: CdkDragDrop<IKanbanItem[]>, dropListId?: number) {
        this.isUpdated.set(true);

        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            await this.updateKanbanList(event.container.data);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            await this.updateKanbanList(event.previousContainer.data);
            await this.updateKanbanList(event.container.data, dropListId);
        }

        this.isUpdated.set(false);
    }
}
