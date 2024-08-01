import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
    WritableSignal,
} from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { KanbanService } from "../../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import {
    DialogDataDeleteProject,
    DialogDeleteProjectComponent,
} from "../../project/dialog/dialog-delete-project/dialog-delete-project.component";
import { MatDialog } from "@angular/material/dialog";
import { SkeletonDirective } from "../../directives/skeleton/skeleton.directive";

@Component({
    selector: "app-sidebar-list",
    standalone: true,
    imports: [
        MatListModule,
        MatIconModule,
        RouterLink,
        MatMenuModule,
        MatButtonModule,
        SkeletonDirective,
    ],
    templateUrl: "./sidebar-list.component.html",
    styleUrl: "./sidebar-list.component.scss",
})
export class SidebarListComponent {
    @Input({ required: true }) isDesktop$!: WritableSignal<boolean>;
    @Output() changeOpenStateEvent = new EventEmitter<boolean>(false);

    kanbanService = inject(KanbanService);
    readonly route = inject(ActivatedRoute);
    readonly dialog = inject(MatDialog);

    me$ = this.kanbanService.me;
    projects$ = this.kanbanService.projects;
    currentProjectId$ = this.kanbanService.currentProjectId;
    isLoading$ = signal(false);

    async ngOnInit(): Promise<void> {
        this.isLoading$.set(true);
        try {
            await firstValueFrom(this.kanbanService.getMe());

            if (this.me$() === undefined) return;
            await firstValueFrom(
                this.kanbanService.getProjects(this.me$()?.id!)
            );
        } catch (error) {
        } finally {
            this.isLoading$.set(false);
        }
    }

    onChangeOpenState(value: boolean) {
        if (this.isDesktop$()) return;

        this.changeOpenStateEvent.emit(value);
    }
    onMenuButtonClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    openDialogDelete(project: DialogDataDeleteProject | null): void {
        if (project === null) return;

        const dialogDeleteRef = this.dialog.open(DialogDeleteProjectComponent, {
            data: { ...project },
        });

        dialogDeleteRef.afterClosed().subscribe();
    }
}
