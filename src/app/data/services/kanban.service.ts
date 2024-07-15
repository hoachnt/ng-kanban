import { inject, Injectable, signal } from "@angular/core";
import {
    IDirectusData,
    IKanbanItem,
    IKanbanList,
} from "../../libraries/directus/directus";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class KanbanService {
    http = inject(HttpClient);
    baseUrl = environment.directusUrl;

    kanbanLists = signal<IKanbanList[] | null>(null);
    kanbanItems = signal<IKanbanItem[] | null>(null);

    constructor() {}

    getKanbanList() {
        return this.http
            .get<IDirectusData<IKanbanList>>(
                `${this.baseUrl}/items/kanban_list`,
                {
                    params: {
                        sort: "currentIndex",
                    },
                }
            )
            .pipe(tap((res) => this.kanbanLists.set(res.data)));
    }
    getKanbanItems() {
        return this.http
            .get<IDirectusData<IKanbanItem>>(
                `${this.baseUrl}/items/kanban_item`
            )
            .pipe(tap((res) => this.kanbanItems.set(res.data)));
    }
    updateKanbanItems(kanban_id: number, newKanban: IKanbanItem) {
        return this.http.patch<IDirectusData<IKanbanItem>>(
            `${this.baseUrl}/items/kanban_item/${kanban_id}`,
            newKanban
        );
    }
}
