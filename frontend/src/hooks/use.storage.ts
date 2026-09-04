import { useState, useCallback, useEffect } from "react";
import type {StorageMetrics} from "../types/storage.ts";
import {StorageService} from "../service/storage.service.ts";
import {handleError} from "../utils/error.handler.ts";
import {getFileSize} from "../utils/file.size.utils.ts";

const DEFAULT_FETCH_ERROR_MESSAGE = "Failed to fetch storage metrics.";

export const useStorage = () => {
    const [metrics, setMetrics] = useState<StorageMetrics>({
        usedSpace: 0,
        totalSpace: 16106127360,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchMetrics = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await StorageService.getStorageMetrics();
            setMetrics(data);
        } catch (err) {
            handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            try {
                const data = await StorageService.getStorageMetrics();
                if (!ignore) setMetrics(data);
            } catch (err) {
                if (!ignore) handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        loadData().then();

        return () => {
            ignore = true;
        };
    }, []);

    const rawPercentage = metrics.totalSpace > 0
        ? (metrics.usedSpace / metrics.totalSpace) * 100
        : 0;

    const percentage = Math.min(Math.max(Math.round(rawPercentage), 0), 100);

    return {
        usedSpace: metrics.usedSpace,
        totalSpace: metrics.totalSpace,
        percentage,
        usedSpaceFormatted: getFileSize(metrics.usedSpace),
        totalSpaceFormatted: getFileSize(metrics.totalSpace),
        isLoading,
        refetch: fetchMetrics,
    };
};