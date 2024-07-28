import { Component, inject } from "@angular/core";
import { DropListGroupComponent } from "../../ui/drop-list-group/drop-list-group.component";
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-home-page",
    standalone: true,
    imports: [],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
})
export class HomePageComponent {
    kanbanService = inject(KanbanService);
    route = inject(ActivatedRoute);

    me$ = this.kanbanService.me;

    ngOnInit(): void {
        firstValueFrom(this.kanbanService.getMe());

        this.route.paramMap.subscribe((params) => {
            this.kanbanService.currentProjectId.set(0);
        });
    }
}
