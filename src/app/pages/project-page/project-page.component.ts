import { Component, inject, signal } from "@angular/core";
import { DropListGroupComponent } from "../../ui/drop-list-group/drop-list-group.component";
import { KanbanService } from "../../data/services/kanban.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { IProject } from "../../libraries/directus/directus";

@Component({
    selector: "app-project-page",
    
    imports: [DropListGroupComponent, AsyncPipe],
    templateUrl: "./project-page.component.html",
    styleUrl: "./project-page.component.scss",
})
export class ProjectPageComponent {
    kanbanService = inject(KanbanService);
    route = inject(ActivatedRoute);

    project$ = signal<IProject | null>(null);

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.route.paramMap.subscribe((params) => {
            this.kanbanService.currentProjectId.set(Number(params.get("id")));
        });

        this.route.params
            .pipe(
                switchMap(({ id }) => {
                    return this.kanbanService.getProjectById(id);
                })
            )
            .subscribe((value) => this.project$.set(value.data));
    }
}
