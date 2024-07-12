import { Component, inject } from "@angular/core";
import {
    CdkDragDrop,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from "@angular/cdk/drag-drop";
import { IDropItem } from "../drop-list/types/interfaces/drop-item.interface";
import { DropListComponent } from "../drop-list/drop-list.component";
import { firstValueFrom } from "rxjs";
import { KanbanService } from "../../data/services/kanban.service";
import { IKanbanItem } from "../../libraries/directus/directus";
import { KanbanItemsFilterPipe } from "../../helpers/pipes/kanban-items-filter.pipe";

@Component({
    selector: "app-drop-list-group",
    standalone: true,
    imports: [DropListComponent, CdkDropListGroup, CdkDropList, KanbanItemsFilterPipe],
    templateUrl: "./drop-list-group.component.html",
    styleUrl: "./drop-list-group.component.scss",
})
export class DropListGroupComponent {
    kanbanService = inject(KanbanService);

    kanbanLists = this.kanbanService.kanbanLists;
    kanbanItems = this.kanbanService.kanbanItems;

    ngOnInit(): void {
        firstValueFrom(this.kanbanService.getKanbanList());
        firstValueFrom(this.kanbanService.getKanbanItems());
    }

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
}
