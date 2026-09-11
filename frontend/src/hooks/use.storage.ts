import { useState, useCallback, useEffect } from "react";
import type { StorageMetrics } from "../types/storage.ts";
import { StorageService } from "../service/storage.service.ts";
import { handleError } from "../utils/error.handler.ts";
import { getFileSize } from "../utils/file.size.utils.ts";

const DEFAULT_FETCH_ERROR_MESSAGE = "Failed to fetch storage metrics.";

let sharedMetrics: StorageMetrics = {
    usedSpace: 0,
    totalSpace: 16106127360,
};

let fetchPromise: Promise<StorageMetrics | null> | null = null;
const listeners = new Set<() => void>();

const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

export const fetchStorageMetrics = async (): Promise<StorageMetrics | null> => {
    if (fetchPromise) {
        return fetchPromise;
    }

    fetchPromise = StorageService.getStorageMetrics()
        .then((data) => {
            if (data) {
                sharedMetrics = {
                    usedSpace: Number(data.usedSpace) || 0,
                    totalSpace: Number(data.totalSpace) || 16106127360,
                };
                notifyListeners();
            }
            return data;
        })
        .catch((err) => {
            handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
            return null;
        })
        .finally(() => {
            fetchPromise = null;
        });

    return fetchPromise;
};

export const setSharedUsedSpace = (
    usedSpaceOrUpdater: number | ((prev: number) => number)
) => {
    const nextUsedSpace =
        typeof usedSpaceOrUpdater === "function"
            ? usedSpaceOrUpdater(sharedMetrics.usedSpace)
            : usedSpaceOrUpdater;

    sharedMetrics = {
        ...sharedMetrics,
        usedSpace: Math.max(0, Math.round(Number(nextUsedSpace) || 0)),
    };
    notifyListeners();
};

export const setSharedMetrics = (newMetrics: StorageMetrics) => {
    sharedMetrics = {
        usedSpace: Number(newMetrics.usedSpace) || 0,
        totalSpace: Number(newMetrics.totalSpace) || 16106127360,
    };
    notifyListeners();
};

export const useStorage = () => {
    const [metrics, setMetrics] = useState<StorageMetrics>(sharedMetrics);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const listener = () => {
            setMetrics(sharedMetrics);
        };
        listeners.add(listener);

        fetchStorageMetrics().finally(() => {
            setIsLoading(false);
        });

        return () => {
            listeners.delete(listener);
        };
    }, []);

    const fetchMetrics = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchStorageMetrics();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const rawPercentage =
        metrics.totalSpace > 0
            ? (metrics.usedSpace / metrics.totalSpace) * 100
            : 0;

    const percentage = Math.min(Math.max(Math.round(rawPercentage), 0), 100);

    const setUsedSpace = useCallback(
        (usedSpaceOrUpdater: number | ((prev: number) => number)) => {
            setSharedUsedSpace(usedSpaceOrUpdater);
        },
        []
    );

    return {
        usedSpace: metrics.usedSpace,
        totalSpace: metrics.totalSpace,
        setUsedSpace,
        percentage,
        usedSpaceFormatted: getFileSize(metrics.usedSpace),
        totalSpaceFormatted: getFileSize(metrics.totalSpace),
        isLoading,
        refetch: fetchMetrics,
    };
};