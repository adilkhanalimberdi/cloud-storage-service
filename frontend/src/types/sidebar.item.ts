import type {Icon} from "../utils/icon.utils.ts";

export type SidebarItemResponse = {
    id: string;
    label: string;
    icon: Icon;
    createdAt: Date
}

export type SidebarItemCreateRequest = {
    label: string;
    icon: Icon;
}