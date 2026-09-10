import type {
    FileCreateRequest,
    FileDownloadUrlResponse,
    FileResponse,
    RenameFileRequest
} from "../types/file.ts";
import {api} from "./api.ts";

export const FileService = {
    async getDownloadUrl(id: string): Promise<FileDownloadUrlResponse> {
        const response = await api.get(`/files/${id}/download-url`);
        return response.data.data;
    },

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
    },

    async rename(id: string, fileName: string): Promise<FileResponse> {
        const payload: RenameFileRequest = {
            fileName: fileName
        }
        const response = await api.patch(`/files/${id}/rename`, payload);
        return response.data.data;
    },

    async softDelete(id: string): Promise<void> {
        await api.delete(`/files/${id}/soft`);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/files/${id}`);
    }
}