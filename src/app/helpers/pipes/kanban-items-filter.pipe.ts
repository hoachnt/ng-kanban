import { Pipe, PipeTransform } from "@angular/core";
import { IKanbanItem } from "../../libraries/directus/directus";

@Pipe({
    name: "kanbanItemsFilter",
    standalone: true,
})
export class KanbanItemsFilterPipe implements PipeTransform {
    transform(
        value: IKanbanItem[],
        kanbanListId: number | undefined
    ): IKanbanItem[] {
        return value.filter(
            (kanbanItem) => kanbanItem.kanban_list_id === kanbanListId
        );
    }
}
