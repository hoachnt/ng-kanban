import { authentication, createDirectus, rest } from "@directus/sdk";
import { environment } from "../../../environments/environment.development";

export interface IKanbanItem {
    id?: number;
    title: string;
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
