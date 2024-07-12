import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { DropItemSortPipe } from "../../helpers/pipes/drop-item-sort.pipe";
import { IKanbanItem } from "../../libraries/directus/directus";

@Component({
    selector: "app-drop-list",
    standalone: true,
    imports: [CdkDrag, CdkDropList, DropItemSortPipe],
    templateUrl: "./drop-list.component.html",
    styleUrl: "./drop-list.component.scss",
})
export class DropListComponent {
    @Input() data!: IKanbanItem[] | null;
    @Input() dropListTitle!: string;
    @Input() connectedTo!: string[];
    @Output() itemDropped = new EventEmitter<CdkDragDrop<IKanbanItem[]>>();

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }
}
