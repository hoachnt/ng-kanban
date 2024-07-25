import { Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
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
    ],
    templateUrl: "./toolbar.component.html",
    styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {
    readonly dialog = inject(MatDialog);
    readonly authService = inject(AuthService);
    readonly themeService = inject(ThemeService);

    isOpen = signal(true);

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
