import { KanbanService } from "./../../../data/services/kanban.service";
import { Component, inject, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { DialogAddKanbanListComponent } from "../../dialog-add-kanban-list/dialog-add-kanban-list.component";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddKanbanItemFormComponent } from "../../dialog-add-kanban-item-form/dialog-add-kanban-item-form.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "../../../auth/auth.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ThemeService } from "../../services/theme.service";
import { SidebarListComponent } from "../../sidebar/sidebar-list/sidebar-list.component";
import { Platform } from "@angular/cdk/platform";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-toolbar",
    standalone: true,
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatTooltipModule,
        SidebarListComponent,
        RouterLink,
    ],
    templateUrl: "./toolbar.component.html",
    styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {
    readonly dialog = inject(MatDialog);
    readonly authService = inject(AuthService);
    readonly themeService = inject(ThemeService);
    readonly kanbanService = inject(KanbanService);

    destroyed = new Subject<void>();
    isProjectId$ = this.kanbanService.currentProjectId;
    currentScreenSize: string = "";

    isOpen = signal(true);

    // Create a map to display breakpoint names for demonstration purposes.
    displayNameMap = new Map([
        [Breakpoints.XSmall, "XSmall"],
        [Breakpoints.Small, "Small"],
    ]);

    constructor(
        private platform: Platform,
        breakpointObserver: BreakpointObserver
    ) {
        breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small])
            .pipe(takeUntil(this.destroyed))
            .subscribe((result) => {
                for (const query of Object.keys(result.breakpoints)) {
                    if (result.breakpoints[query]) {
                        this.currentScreenSize =
                            this.displayNameMap.get(query) ?? "Unknown";
                    }
                }
            });

        this.isOpen.set(
            !this.platform.ANDROID &&
                !this.platform.IOS &&
                this.currentScreenSize !== "XSmall" &&
                this.currentScreenSize !== "Small"
        );

        console.log(this.isOpen());
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }

    openKanbanListDialog(): void {
        const dialogRef = this.dialog.open(DialogAddKanbanListComponent);

        dialogRef.afterClosed().subscribe();
    }
    openKanbanItemDialog(): void {
        const dialogRef = this.dialog.open(DialogAddKanbanItemFormComponent);

        dialogRef.afterClosed().subscribe();
    }
    onLogout() {
        this.authService.logout();
    }
    onOpenedChangDrawer(isOpen: boolean) {
        this.isOpen.set(isOpen);
    }
    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
