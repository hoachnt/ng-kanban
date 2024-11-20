import { Component } from "@angular/core";

import { ChangeDetectorRef, effect, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { IProject } from "../../../../libraries/directus/directus";
import { KanbanService } from "../../../../data/services/kanban.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom, switchMap } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";

export interface DialogData extends IProject {}

@Component({
    selector: "app-dialog-update-project",
    
    templateUrl: "./dialog-update-project.component.html",
    styleUrl: "./dialog-update-project.component.scss",
    imports: [
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
    ],
})
export class DialogUpdateProjectComponent {
    readonly dialogRef = inject(MatDialogRef<DialogUpdateProjectComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly fb = inject(FormBuilder);
    readonly cdr = inject(ChangeDetectorRef);
    readonly kanbanService = inject(KanbanService);

    readonly kabanList = this.kanbanService.kanbanLists;
    readonly isUpdating = signal(false);
    readonly me$ = this.kanbanService.me;

    form = this.fb.group({
        name: ["", Validators.required],
    });

    constructor(private _snackBar: MatSnackBar) {
        effect(() => {
            this.form.patchValue({
                name: this.data.name,
            });
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onUpdateProject() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid)
            return this.openSnackBar("Name required!", "warning");
        if (this.data.id === undefined)
            return this.openSnackBar("Project ID is not found", "error");

        try {
            this.isUpdating.set(true);

            await firstValueFrom(
                this.kanbanService.updateProject(
                    {
                        ...this.data,
                        name: this.form.value.name!,
                    },
                    this.data.id
                )
            );

            if (this.me$() === undefined) return;

            await firstValueFrom(
                this.kanbanService.getProjects(this.me$()?.id!)
            );
            this.openSnackBar("Successfully updated!", "success");
        } catch (error) {
            this.openSnackBar("Error during update project!", "error");
        } finally {
            this.dialogRef.close();
            this.isUpdating.set(false);
        }
    }

    openSnackBar(
        title: string,
        snackbarTypeClass?: "success" | "error" | "warning"
    ) {
        const panelClass = snackbarTypeClass
            ? `${snackbarTypeClass}-snackbar`
            : "";

        this._snackBar.open(title, "Ok", {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 5000,
            panelClass: panelClass ? [panelClass] : undefined,
        });
    }
}
