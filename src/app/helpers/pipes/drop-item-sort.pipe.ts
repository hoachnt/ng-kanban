import { Pipe, PipeTransform } from "@angular/core";
import { IKanbanItem } from "../../libraries/directus/directus";

@Pipe({
    name: "dropItemSort",
    
})
export class DropItemSortPipe implements PipeTransform {
    transform(value: IKanbanItem[] | null): IKanbanItem[] {
        if (value === null) return [];

        return value.sort(
            (a: IKanbanItem, b: IKanbanItem) => a.currentIndex - b.currentIndex
        );
    }
}
