import {
    Component,
    EventEmitter,
    Input,
    Output,
    WritableSignal,
} from "@angular/core";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { DropItemSortPipe } from "../../helpers/pipes/drop-item-sort.pipe";
import { IKanbanItem } from "../../libraries/directus/directus";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: "app-drop-list",
    standalone: true,
    imports: [CdkDrag, CdkDropList, DropItemSortPipe, MatCardModule],
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

    isDisabled = true;

    drop(event: CdkDragDrop<IKanbanItem[]>) {
        this.itemDropped.emit(event);
    }
}
