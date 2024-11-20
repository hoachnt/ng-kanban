import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from "@angular/core";
import { KanbanService } from "../../data/services/kanban.service";
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { IProject, IUser } from "../../libraries/directus/directus";
import { firstValueFrom } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-dialog-add-project",
    
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
    templateUrl: "./dialog-add-project.component.html",
    styleUrl: "./dialog-add-project.component.scss",
})
export class DialogAddProjectComponent {
    @ViewChild("nameInput") titleInput!: ElementRef;

    kanbanService = inject(KanbanService);
    readonly dialogRef = inject(MatDialogRef<DialogAddProjectComponent>);
    fb = inject(FormBuilder);
    cdr = inject(ChangeDetectorRef);

    isDisabling = signal(false);
    horizontalPosition: MatSnackBarHorizontalPosition = "right";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    me$ = this.kanbanService.me;

    form = this.fb.group({
        name: ["", Validators.required],
    });

    constructor(private _snackBar: MatSnackBar) {}

    ngAfterViewInit() {
        this.titleInput.nativeElement.focus();
        this.cdr.detectChanges(); // Принудительное обновление обнаружения изменений
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onCreateProject() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid)
            return this.openSnackBar("Name required!", "warning");

        this.isDisabling.set(true);

        const newProject: IProject = {
            name: this.form.value.name!,
            kanban_lists_id: [],
        };

        try {
            await firstValueFrom(this.kanbanService.postProject(newProject));

            if (this.me$()?.id === undefined)
                return this.openSnackBar("Can not find user id!", "warning");

            await firstValueFrom(
                this.kanbanService.getProjects((this.me$() as IUser)?.id)
            );

            this.openSnackBar("Project created successfully!", "success");
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
