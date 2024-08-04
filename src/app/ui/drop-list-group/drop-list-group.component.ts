import {
    Component,
    inject,
    Input,
    signal,
    SimpleChanges,
    OnChanges,
} from "@angular/core";
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
import { IKanbanItem } from "../../libraries/directus/directus";
import { KanbanItemsFilterPipe } from "../../helpers/pipes/kanban-items-filter.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SortByDatePipePipe } from "../../helpers/pipes/sort-by-date-pipe.pipe";
import { ActivatedRoute } from "@angular/router";
import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
} from "@angular/animations";

const fadeListAnimation = trigger("listAnimation", [
    transition("* => *", [
        query(":enter", style({ opacity: 0 }), { optional: true }),
        query(":leave", animate("300ms ease-in-out", style({ opacity: 0 })), {
            optional: true,
        }),
        query(
            ":enter",
            stagger("60ms", [
                animate("300ms ease-in-out", style({ opacity: 1 })),
            ]),
            { optional: true }
        ),
    ]),
]);

@Component({
    selector: "app-drop-list-group",
    standalone: true,
    imports: [
        DropListComponent,
        CdkDropListGroup,
        CdkDropList,
        KanbanItemsFilterPipe,
        MatButtonModule,
        MatIconModule,
        SortByDatePipePipe,
    ],
    animations: [fadeListAnimation],
    templateUrl: "./drop-list-group.component.html",
    styleUrls: ["./drop-list-group.component.scss"], // Исправлено styleUrl на styleUrls
})
export class DropListGroupComponent implements OnChanges {
    @Input() projectId!: number | undefined;

    kanbanService = inject(KanbanService);
    route = inject(ActivatedRoute);

    kanbanLists = this.kanbanService.kanbanLists;
    kanbanItems = this.kanbanService.kanbanItems;
    me$ = this.kanbanService.me;

    isUpdating = signal(false);
    currentView$ = signal<"loading" | "empty" | "list">("loading");

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["projectId"] && this.projectId !== undefined) {
            this.loadData();
        }
    }

    async loadData(): Promise<void> {
        this.currentView$.set("loading");

        try {
            if (this.projectId === undefined) return;

            await firstValueFrom(
                this.kanbanService.getKanbanList(this.projectId)
            );

            if (this.me$() === undefined) return;

            await firstValueFrom(
                this.kanbanService.getKanbanItems(this.me$()?.id!)
            );
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setTimeout(() => {
                if (
                    this.kanbanLists() === null ||
                    this.kanbanLists()!.length === 0
                ) {
                    this.currentView$.set("empty");
                } else {
                    this.currentView$.set("list");
                }
            }, 200); // Adjust delay as needed
        }
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
                    this.kanbanService.updateKanbanItem(
                        kanbanItem.id,
                        kanbanItem
                    )
                );
            } catch (error) {
                console.error("Error when updating kanban item:", error);
            }
        }

        if (this.me$() === undefined) return;

        await firstValueFrom(
            this.kanbanService.getKanbanItems(this.me$()?.id!)
        );
    }

    async drop(event: CdkDragDrop<IKanbanItem[]>, dropListId?: number) {
        this.isUpdating.set(true);

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

        this.isUpdating.set(false);
    }
}
