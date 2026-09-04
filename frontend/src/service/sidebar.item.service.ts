import type {Icon, SidebarItemCreateRequest, SidebarItemResponse} from "../types/sidebar.item.ts";
import {api} from "./api.ts";

export const SidebarItemService = {
    async getAll(): Promise<SidebarItemResponse[]> {
        const response = await api.get("/sidebar-items");
        return response.data.data;
    },

    async create(label: string, icon: Icon): Promise<SidebarItemResponse> {
        const payload: SidebarItemCreateRequest = {
            label: label,
            icon: icon,
        };
        const response = await api.post("/sidebar-items", payload);
        return response.data.data;
    }
}