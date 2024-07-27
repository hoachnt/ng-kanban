import { Component, inject } from "@angular/core";
import { DropListGroupComponent } from "../../ui/drop-list-group/drop-list-group.component";
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";

@Component({
    selector: "app-home-page",
    standalone: true,
    imports: [],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
})
export class HomePageComponent {
    kanbanService = inject(KanbanService);
    me$ = this.kanbanService.me;

    ngOnInit(): void {
        firstValueFrom(this.kanbanService.getMe());
    }
}
