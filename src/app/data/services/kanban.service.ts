import { inject, Injectable, signal } from "@angular/core";
import {
    IDirectusData,
    IDirectusDataObject,
    IKanbanItem,
    IKanbanList,
    IProject,
    IUser,
} from "../../libraries/directus/directus";
import { HttpClient, HttpParams } from "@angular/common/http";
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
    projects = signal<IProject[] | null>(null);
    me = signal<IUser | null>(null);

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
    updateKanbanItem(kanban_id: number, newKanban: IKanbanItem) {
        return this.http.patch<IDirectusData<IKanbanItem>>(
            `${this.baseUrl}/items/kanban_item/${kanban_id}`,
            newKanban
        );
    }
    deleteKanbanItem(kanban_id: number) {
        return this.http.delete<IDirectusData<IKanbanItem>>(
            `${this.baseUrl}/items/kanban_item/${kanban_id}`
        );
    }
    postKanbanItem(data: IKanbanItem) {
        return this.http.post<IKanbanItem>(
            `${this.baseUrl}/items/kanban_item`,
            data
        );
    }
    postKanbanList(data: IKanbanList) {
        return this.http.post<IKanbanList>(
            `${this.baseUrl}/items/kanban_list`,
            data
        );
    }
    deleteKanbanList(kanban_list_id: number) {
        return this.http.delete<IDirectusData<IKanbanItem>>(
            `${this.baseUrl}/items/kanban_list/${kanban_list_id}`
        );
    }
    updateKanbanList(kanban_list_id: number, newKanbanList: IKanbanList) {
        return this.http.patch<IDirectusData<IKanbanList>>(
            `${this.baseUrl}/items/kanban_list/${kanban_list_id}`,
            newKanbanList
        );
    }
    getMe() {
        return this.http
            .get<IDirectusDataObject<IUser>>(`${this.baseUrl}/users/me`)
            .pipe(tap((res) => this.me.set(res.data)));
    }
    getProjects(user_id: string) {
        const params = new HttpParams().set(
            "filter[user_created][_eq]",
            user_id
        );

        return this.http
            .get<IDirectusData<IProject>>(`${this.baseUrl}/items/projects`, {
                params,
            })
            .pipe(tap((res) => this.projects.set(res.data)));
    }
}
