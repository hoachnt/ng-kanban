import {
    Component,
    effect,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from "@angular/core";
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
import { KanbanService } from "../../../../data/services/kanban.service";
import { IKanbanItem } from "../../../../libraries/directus/directus";
import { firstValueFrom } from "rxjs";
import { DatePipe } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";

interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-dialog-update-kanban-item",
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatDatepickerModule,
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

    isDisabling = signal(false);

    form = this.fb.group({
        title: ["", Validators.required],
        deadline: [null as Date | null],
    });

    constructor() {
        effect(() => {
            this.form.patchValue({
                title: this.data.title || "",
                deadline: this.data.deadline
                    ? new Date(this.data.deadline)
                    : null,
            });
        });
    }

    ngAfterViewInit() {
        this.titleInput.nativeElement.focus();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async onUpdateKanbanItem() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) return;
        if (this.data.id === undefined) return;

        this.isDisabling.set(true);

        const formattedDeadline = this.form.value.deadline
            ? this.datePipe.transform(
                  this.form.value.deadline,
                  "yyyy-MM-ddTHH:mm:ss"
              )
            : null;

        await firstValueFrom(
            this.kanbanService.updateKanbanItem(this.data.id, {
                ...this.data,
                title: this.form.value.title!,
                deadline: formattedDeadline,
            })
        );
        await firstValueFrom(this.kanbanService.getKanbanItems());

        this.dialogRef.close();
        this.isDisabling.set(false);
    }
}
