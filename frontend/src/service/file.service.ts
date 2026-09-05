import type {FileResponse} from "../types/file.ts";
import {api} from "./api.ts";

export const FileService = {
    async upload(files: File[], folderId: string): Promise<FileResponse> {
        const payload = new FormData();
        files.forEach(file => {
            payload.append("files", file);
        })
        const response = await api.post("/files", payload, {
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