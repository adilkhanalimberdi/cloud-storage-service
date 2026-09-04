import {api} from "./api.ts";
import type {ApiResponse} from "../types/api.ts";
import type {StorageMetrics} from "../types/storage.ts";

export const StorageService = {
    async getStorageMetrics(): Promise<StorageMetrics> {
        const response = await api.get<ApiResponse<StorageMetrics>>("/storage");
        return response.data.data;
    }
};