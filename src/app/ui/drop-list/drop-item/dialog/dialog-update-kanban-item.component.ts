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
    ],
    templateUrl: "./dialog-update-kanban-item.component.html",
})
export class DialogUpdateKanbanItemComponent {
    @ViewChild("titleInput") titleInput!: ElementRef;

    kanbanService = inject(KanbanService);

    readonly dialogRef = inject(MatDialogRef<DialogUpdateKanbanItemComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    fb = inject(FormBuilder);

    isDisabling = signal(false);

    form = this.fb.group({
        title: ["", Validators.required],
    });

    constructor() {
        effect(() => {
            this.form.patchValue(this.data);
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

        await firstValueFrom(
            this.kanbanService.updateKanbanItem(this.data.id, {
                ...this.data,
                title: this.form.value.title!,
            })
        );
        await firstValueFrom(this.kanbanService.getKanbanItems());

        this.dialogRef.close();
        this.isDisabling.set(false);
    }
}
