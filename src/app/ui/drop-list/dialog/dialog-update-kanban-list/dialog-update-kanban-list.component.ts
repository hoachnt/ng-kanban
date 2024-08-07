import {
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { IKanbanList } from "../../../../libraries/directus/directus";
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
import { ActivatedRoute } from "@angular/router";
interface DialogData extends IKanbanList {}

@Component({
    selector: "app-dialog-update-kanban-list",
    standalone: true,
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
    templateUrl: "./dialog-update-kanban-list.component.html",
    styleUrl: "./dialog-update-kanban-list.component.scss",
})
export class DialogUpdateKanbanListComponent {
    readonly dialogRef = inject(MatDialogRef<DialogUpdateKanbanListComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly fb = inject(FormBuilder);
    readonly cdr = inject(ChangeDetectorRef);
    readonly kanbanService = inject(KanbanService);

    readonly kabanList = this.kanbanService.kanbanLists;
    readonly isUpdating = signal(false);

    form = this.fb.group({
        currentIndex: [0, Validators.required],
    });

    constructor(private _snackBar: MatSnackBar) {
        effect(() => {
            this.form.patchValue({
                currentIndex: this.data.currentIndex + 1,
            });
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onUpdateKanbanList() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid)
            return this.openSnackBar("Position required!", "warning");
        if (this.data.id === undefined)
            return this.openSnackBar("List ID is not found", "error");

        try {
            this.isUpdating.set(true);

            await firstValueFrom(
                this.kanbanService.updateKanbanList(this.data.id, {
                    ...this.data,
                    currentIndex: this.form.value.currentIndex! - 1,
                })
            );

            await firstValueFrom(
                this.kanbanService.getKanbanList(
                    this.kanbanService.currentProjectId()
                )
            );
            this.openSnackBar("Successfully updated!", "success");
        } catch (error) {
            this.openSnackBar("Error during update list!", "error");
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
