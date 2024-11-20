import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "truncateText",
    
})
export class TruncateTextPipe implements PipeTransform {
    transform(value: string, maxLength: number): string {
        if (value.length > maxLength) {
            return value.slice(0, maxLength) + "...";
        }

        return value;
    }
}
