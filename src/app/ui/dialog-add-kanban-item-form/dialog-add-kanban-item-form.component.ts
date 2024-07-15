import { Component, inject, signal } from "@angular/core";
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
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { KanbanService } from "../../data/services/kanban.service";
import { firstValueFrom } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

export interface DialogData extends IKanbanItem {}

@Component({
    selector: "app-dialog-add-kanban-item-form",
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
    templateUrl: "./dialog-add-kanban-item-form.component.html",
    styleUrl: "./dialog-add-kanban-item-form.component.scss",
})
export class DialogAddKanbanItemFormComponent {
    kanbanService = inject(KanbanService);

    readonly dialogRef = inject(MatDialogRef<DialogAddKanbanItemFormComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    isDisabling = signal(false);

    form = new FormGroup({
        title: new FormControl<string | null>(null, Validators.required),
    });

    onNoClick(): void {
        this.dialogRef.close();
    }
    async onCreateKanbanItem() {
        if (!this.form.valid) return;

        this.isDisabling.set(true);

        const kanbanLists = this.kanbanService.kanbanLists();
        const getKanbanListId = kanbanLists ? kanbanLists[0]?.id : null;

        if (!getKanbanListId) {
            console.error("Kanban list ID is null or undefined");
            return;
        }

        const newKanbanItem: IKanbanItem = {
            title: this.form.value.title!,
            currentIndex: 0,
            kanban_list_id: getKanbanListId,
        };

        await firstValueFrom(this.kanbanService.postKanbanItem(newKanbanItem));
        await firstValueFrom(this.kanbanService.getKanbanItems());

        this.dialogRef.close();
        this.isDisabling.set(false);
    }
}
