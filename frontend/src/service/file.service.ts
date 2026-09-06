import type {FileCreateRequest, FileResponse} from "../types/file.ts";
import {api} from "./api.ts";

export const FileService = {
    async create(fileName: string, content: string, folderId: string): Promise<FileResponse> {
        const payload: FileCreateRequest = {
            fileName: fileName,
            content: content,
        }
        const response = await api.post("/files", payload, {
            params: {
                "folderId": folderId,
            }
        });
        return response.data.data;
    },

    async upload(files: File[], folderId: string): Promise<FileResponse> {
        const payload = new FormData();
        files.forEach(file => {
            payload.append("files", file);
        })
        const response = await api.post("/files/upload", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params: {
                "folderId": folderId,
            }
        });
        return response.data.data;
    }
}