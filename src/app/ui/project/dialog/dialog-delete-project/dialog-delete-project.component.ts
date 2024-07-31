import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { KanbanService } from "../../../../data/services/kanban.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";
import { IProject, IUser } from "../../../../libraries/directus/directus";

export interface DialogDataDeleteProject extends IProject {}

@Component({
    selector: "app-dialog-delete-project",
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
    ],
    templateUrl: "./dialog-delete-project.component.html",
    styleUrl: "./dialog-delete-project.component.scss",
})
export class DialogDeleteProjectComponent {
    readonly dialogRef = inject(MatDialogRef<DialogDeleteProjectComponent>);
    readonly data = inject<DialogDataDeleteProject>(MAT_DIALOG_DATA);

    readonly kanbanService = inject(KanbanService);
    readonly isDeleting = signal(false);
    readonly me$ = this.kanbanService.me;

    constructor(private _snackBar: MatSnackBar) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onDeleteProject() {
        if (this.data.id === undefined) return;

        this.isDeleting.set(true);

        try {
            await firstValueFrom(
                this.kanbanService.deleteProject(this.data.id)
            );

            if (this.me$() === null) return;
            await firstValueFrom(
                this.kanbanService.getProjects((this.me$() as IUser).id)
            );

            this.openSnackBar("Successfully deleted!");
        } catch (error) {
            this.openSnackBar("Error during delete project!");
        } finally {
            this.dialogRef.close();
            this.isDeleting.set(false);
        }
    }

    openSnackBar(title: string) {
        this._snackBar.open(title, "Ok", {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 5000,
        });
    }
}
