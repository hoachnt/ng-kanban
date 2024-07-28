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
import { firstValueFrom, switchMap } from "rxjs";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
    selector: "app-sidebar-list",
    standalone: true,
    imports: [MatListModule, MatIconModule, RouterLink],
    templateUrl: "./sidebar-list.component.html",
    styleUrl: "./sidebar-list.component.scss",
})
export class SidebarListComponent {
    @Input({ required: true }) isDesktop$!: WritableSignal<boolean>;
    @Output() changeOpenStateEvent = new EventEmitter<boolean>(false);

    kanbanService = inject(KanbanService);
    readonly route = inject(ActivatedRoute);

    me$ = this.kanbanService.me;
    projects$ = this.kanbanService.projects;
    currentProjectId$ = this.kanbanService.currentProjectId;

    async ngOnInit(): Promise<void> {
        await firstValueFrom(this.kanbanService.getMe());

        if (this.me$() === undefined) return;
        await firstValueFrom(this.kanbanService.getProjects(this.me$()?.id!));
    }

    onChangeOpenState(value: boolean) {
        if (this.isDesktop$()) return;

        this.changeOpenStateEvent.emit(value);
    }
}
