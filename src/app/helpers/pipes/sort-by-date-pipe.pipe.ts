import { Pipe, PipeTransform } from "@angular/core";
import { IKanbanList } from "../../libraries/directus/directus";

@Pipe({
    name: "sortByDatePipe",
    
})
export class SortByDatePipePipe implements PipeTransform {
    transform(value: IKanbanList[] | null) {
        if (!value || value.length === 0) {
            return value;
        }

        return value.sort((a, b) => {
            if (a.currentIndex === b.currentIndex) {
                if (a.date_created && b.date_created) {
                    const dateA = new Date(a.date_created).getTime();
                    const dateB = new Date(b.date_created).getTime();
                    return dateB - dateA; // Sorting from newest to oldest
                }
                if (a.date_created) {
                    return -1; // `a` comes first if it has a date and `b` does not
                }
                if (b.date_created) {
                    return 1; // `b` comes first if it has a date and `a` does not
                }
                return 0; // if neither has a date, consider them equal
            }
            return a.currentIndex - b.currentIndex; // Compare currentIndex if dates are not compared
        });
    }
}
