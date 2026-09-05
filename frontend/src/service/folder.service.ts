import type {FolderCreateRequest, FolderResponse} from "../types/folder.ts";
import {api} from "./api.ts";
import type {FolderIcon} from "../utils/icon.utils.ts";

export const FolderService = {
    async getById(id: string): Promise<FolderResponse> {
        const response = await api.get(`/folders/${id}`);
        return response.data.data;
    },

    async getAllRoot(): Promise<FolderResponse[]> {
        const response = await api.get("/folders", {
            params: {
                "isRoot": true,
            }
        });
        return response.data.data;
    },

    async create(name: string, icon: FolderIcon, parentId: string | null): Promise<FolderResponse> {
        const payload: FolderCreateRequest = {
            name: name,
            icon: icon,
            parentId: parentId && parentId.trim() !== "" ? parentId : null,
        }
        const response = await api.post("/folders", payload);
        return response.data.data;
    }
}