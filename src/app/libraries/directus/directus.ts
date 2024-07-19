import { authentication, createDirectus, rest } from "@directus/sdk";
import { environment } from "../../../environments/environment.development";
import { ITokenResponse } from "../../auth/auth.type";

export interface IKanbanItem {
    id?: number;
    title: string;
    description?: string | null;
    deadline?: string | null;
    currentIndex: number;
    kanban_list_id: number;
}

export interface IKanbanList {
    id?: number;
    title: string;
    kanban_items_id: number[];
}

export interface IDirectusData<T> {
    data: T[];
}

export interface IDirectusLoginData {
    data: ITokenResponse;
}

type Schema = {
    kanban_list: IKanbanList[];
    kanban_item: IKanbanItem[];
};

const directusItems = createDirectus<Schema>(environment.directusUrl).with(
    rest()
);
const directusAuth = createDirectus(environment.directusUrl).with(
    authentication()
);

export { directusItems, directusAuth };
