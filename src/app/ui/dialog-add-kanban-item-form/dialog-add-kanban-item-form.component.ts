import {
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild,
    AfterViewInit,
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
    MAT_DIALOG_DATA,
    MatDialogTitle,
    MatDialogClose,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IKanbanItem } from "../../libraries/directus/directus";
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DatePipe, registerLocaleData } from "@angular/common";
import localeVi from "@angular/common/locales/vi";

// Регистрация локали
registerLocaleData(localeVi);

export interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-dialog-add-kanban-item-form",
    standalone: true,
    providers: [DatePipe],
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
        MatDatepickerModule,
    ],
    templateUrl: "./dialog-add-kanban-item-form.component.html",
    styleUrls: ["./dialog-add-kanban-item-form.component.scss"],
})
export class DialogAddKanbanItemFormComponent implements AfterViewInit {
    @ViewChild("titleInput") titleInput!: ElementRef;

    kanbanService = inject(KanbanService);
    datePipe = inject(DatePipe);
    readonly dialogRef = inject(MatDialogRef<DialogAddKanbanItemFormComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    fb = inject(FormBuilder);
    cdr = inject(ChangeDetectorRef);

    isDisabling = signal(false);
    me$ = this.kanbanService.me;

    horizontalPosition: MatSnackBarHorizontalPosition = "right";
    verticalPosition: MatSnackBarVerticalPosition = "top";

    form = this.fb.group({
        title: ["", Validators.required],
        description: [""],
        deadline: [null],
    });

    constructor(private _snackBar: MatSnackBar) {}

    ngAfterViewInit() {
        this.titleInput.nativeElement.focus();
        this.cdr.detectChanges(); // Принудительное обновление обнаружения изменений
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onCreateKanbanItem() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid)
            return this.openSnackBar("Title required!", "warning");

        this.isDisabling.set(true);

        const kanbanLists = this.kanbanService.kanbanLists();
        const getKanbanListId = kanbanLists ? kanbanLists[0]?.id : null;

        if (!getKanbanListId) {
            console.error("Kanban list ID is null or undefined");
            return;
        }

        const formattedDeadline = this.form.value.deadline
            ? this.datePipe.transform(
                  this.form.value.deadline,
                  "yyyy-MM-ddTHH:mm:ss"
              )
            : null;

        const newKanbanItem: IKanbanItem = {
            title: this.form.value.title!,
            description: this.form.value.description,
            deadline: formattedDeadline,
            currentIndex: 0,
            kanban_list_id: getKanbanListId,
        };

        try {
            await firstValueFrom(
                this.kanbanService.postKanbanItem(newKanbanItem)
            );

            if (this.me$() === undefined) return;

            await firstValueFrom(
                this.kanbanService.getKanbanItems(this.me$()?.id!)
            );

            this.openSnackBar("Task added successfully!", "success");
        } catch (error) {
            this.openSnackBar("Error adding task!", "error");
        } finally {
            this.dialogRef.close();
            this.isDisabling.set(false);
        }
    }

    openSnackBar(
        title: string,
        snackbarTypeClass?: "success" | "error" | "warning"
    ) {
        this._snackBar.open(title, "Ok", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000,
            // panelClass: [
            //     snackbarTypeClass === "success"
            //         ? "green-snackbar"
            //         : snackbarTypeClass === "error"
            //         ? "red-snackbar"
            //         : snackbarTypeClass === "warning"
            //         ? "warning-snackbar"
            //         : "",
            // ],
        });
    }
}
