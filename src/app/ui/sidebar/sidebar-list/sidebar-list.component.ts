import { Component, inject } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { KanbanService } from "../../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";

@Component({
    selector: "app-sidebar-list",
    standalone: true,
    imports: [MatListModule, MatIconModule],
    templateUrl: "./sidebar-list.component.html",
    styleUrl: "./sidebar-list.component.scss",
})
export class SidebarListComponent {
    kanbanService = inject(KanbanService);

    me$ = this.kanbanService.me;
    projects$ = this.kanbanService.projects;

    async ngOnInit(): Promise<void> {
        await firstValueFrom(this.kanbanService.getMe());

        if (this.me$() === undefined) return;
        await firstValueFrom(this.kanbanService.getProjects(this.me$()?.id!));
    }
}
