import {
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild,
    ChangeDetectorRef,
} from "@angular/core";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

import {
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
    MatDialogClose,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IKanbanList } from "../../libraries/directus/directus";
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";

export interface DialogData extends IKanbanList {}

@Component({
    selector: "app-dialog-add-kanban-list",
    
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
    ],
    templateUrl: "./dialog-add-kanban-list.component.html",
    styleUrl: "./dialog-add-kanban-list.component.scss",
})
export class DialogAddKanbanListComponent {
    @ViewChild("titleInput") titleInput!: ElementRef;

    kanbanService = inject(KanbanService);
    readonly dialogRef = inject(MatDialogRef<DialogAddKanbanListComponent>);
    fb = inject(FormBuilder);
    cdr = inject(ChangeDetectorRef);

    isDisabling = signal(false);
    currentProjectId$ = this.kanbanService.currentProjectId;
    projects$ = this.kanbanService.projects;

    horizontalPosition: MatSnackBarHorizontalPosition = "right";
    verticalPosition: MatSnackBarVerticalPosition = "top";

    form = this.fb.group({
        title: ["", Validators.required],
    });

    constructor(private _snackBar: MatSnackBar) {}

    ngAfterViewInit() {
        this.titleInput.nativeElement.focus();
        this.cdr.detectChanges(); // Принудительное обновление обнаружения изменений
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onCreateKanbanList() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid)
            return this.openSnackBar("Title required!", "warning");

        const newKanbanList: IKanbanList = {
            title: this.form.value.title!,
            currentIndex: 0,
            kanban_items_id: [],
        };

        try {
            this.isDisabling.set(true);

            const { data: res } = await firstValueFrom(
                this.kanbanService.postKanbanList(newKanbanList)
            );

            const project = await firstValueFrom(
                this.kanbanService.getProjectById(this.currentProjectId$())
            );

            if (!res.id) return;

            // Изменяем O2M по синтаксису directus
            await firstValueFrom(
                this.kanbanService.updateProject(
                    {
                        kanban_lists_id: {
                            update: [
                                {
                                    id: res.id,
                                    project_id: this.currentProjectId$(),
                                },
                            ],
                        },
                    },
                    this.currentProjectId$()
                )
            );

            await firstValueFrom(
                this.kanbanService.getKanbanList(this.currentProjectId$())
            );

            this.openSnackBar("List added successfully!", "success");
        } catch (error) {
            this.openSnackBar("Error adding list!", "error");
        } finally {
            this.dialogRef.close();
            this.isDisabling.set(false);
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
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000,
            panelClass: panelClass ? [panelClass] : undefined,
        });
    }
}
