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
    date_created?: Date | null;
    id?: number;
    title: string;
    kanban_items_id: number[];
    currentIndex: number;
}

export interface IProject {
    date_created?: Date | null;
    user_created: string;
    id?: number;
    name: string;
    kanban_lists_id: number[];
}

export interface IUser {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
}

export interface IDirectusData<T> {
    data: T[];
}

export interface IDirectusDataObject<T> {
    data: T;
}

export interface IDirectusLoginData {
    data: ITokenResponse;
}
export interface IDirectusRegisterData {
    data: IUser;
}

type Schema = {
    kanban_list: IKanbanList[];
    kanban_item: IKanbanItem[];
    projects: IProject[];
    user: IUser;
};

const directusItems = createDirectus<Schema>(environment.directusUrl).with(
    rest()
);
const directusAuth = createDirectus(environment.directusUrl).with(
    authentication()
);

export { directusItems, directusAuth };
