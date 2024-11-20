import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { KanbanService } from "../../../data/services/kanban.service";
import { IKanbanItem, IUser } from "../../../libraries/directus/directus";
import { firstValueFrom } from "rxjs";
import { DatePipe } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";

interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-dialog-update-kanban-item",

    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatSelectModule,
    ],
    providers: [DatePipe],
    templateUrl: "./dialog-update-kanban-item.component.html",
})
export class DialogUpdateKanbanItemComponent {
    @ViewChild("titleInput") titleInput!: ElementRef;

    kanbanService = inject(KanbanService);
    datePipe = inject(DatePipe);
    readonly dialogRef = inject(MatDialogRef<DialogUpdateKanbanItemComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    fb = inject(FormBuilder);
    cdr = inject(ChangeDetectorRef);

    isDisabling = signal(false);
    kanbanLists = this.kanbanService.kanbanLists;
    me$ = this.kanbanService.me;

    form = this.fb.group({
        title: ["", Validators.required],
        description: [""],
        deadline: [null as Date | null],
        kanban_list_id: [0 as number],
    });

    constructor(private _snackBar: MatSnackBar) {
        this.form.patchValue({
            title: this.data.title || "",
            description: this.data.description,
            deadline: this.data.deadline ? new Date(this.data.deadline) : null,
            kanban_list_id: this.data.kanban_list_id,
        });
    }

    ngAfterViewInit() {
        this.titleInput.nativeElement.focus();
        this.cdr.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onUpdateKanbanItem() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid)
            return this.openSnackBar("Title required!", "warning");
        if (this.data.id === undefined)
            return this.openSnackBar("Task ID is not found", "error");

        const formattedDeadline = this.form.value.deadline
            ? this.datePipe.transform(
                  this.form.value.deadline,
                  "yyyy-MM-ddTHH:mm:ss"
              )
            : null;

        try {
            this.isDisabling.set(true);

            await firstValueFrom(
                this.kanbanService.updateKanbanItem(this.data.id, {
                    ...this.data,
                    title: this.form.value.title!,
                    description: this.form.value.description,
                    deadline: formattedDeadline,
                    kanban_list_id: this.form.value.kanban_list_id!,
                })
            );

            if (this.me$() === undefined) return;

            await firstValueFrom(
                this.kanbanService.getKanbanItems((this.me$() as IUser).id)
            );

            this.openSnackBar("Successfully updated!", "success");
        } catch (error) {
            this.openSnackBar("Error during update task!", "error");
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
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 5000,
            panelClass: panelClass ? [panelClass] : undefined,
        });
    }
}
