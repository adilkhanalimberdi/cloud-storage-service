import {useCallback, useEffect, useState} from "react";
import type {SidebarItemResponse} from "../types/sidebar.item.ts";
import {SidebarItemService} from "../service/sidebar.item.service.ts";
import {handleError} from "../utils/error.handler.ts";
import type {Icon} from "../utils/icon.utils.ts";
import toast from "react-hot-toast";

const DEFAULT_FETCH_ERROR_MESSAGE = "Failed to fetch sidebar items.";

export const useSidebar = () => {
    const [sidebarItems, setSidebarItems] = useState<SidebarItemResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newSidebarLabel, setNewSidebarLabel] = useState<string>("");
    const [newSidebarIcon, setNewSidebarIcon] = useState<Icon>("FOLDER");
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const clearForm = () => {
        setNewSidebarLabel("");
        setNewSidebarIcon("FOLDER");
    }

    const handleCreateSidebar = async () => {
        setIsCreating(true);
        try {
            await SidebarItemService.create(newSidebarLabel, newSidebarIcon);
            await refetch();
            toast.success("Folder created successfully!");
            setIsCreating(false);
            clearForm();
        } catch (err) {
            handleError(err as Error, "Failed to create new folder.");
        }
    }

    const refetch = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await SidebarItemService.getAll();
            setSidebarItems(data);
        } catch (err) {
            handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const data = await SidebarItemService.getAll();
                if (isMounted) {
                    setSidebarItems(data);
                }
            } catch (err) {
                handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
            } finally {
                setIsLoading(false);
            }
        }

        loadData().then();

        return () => {
            isMounted = false;
        }
    }, []);

    return {
        sidebarItems,
        setSidebarItems,
        isLoading,
        isCreating,
        refetch,
        newSidebarLabel,
        setNewSidebarLabel,
        newSidebarIcon,
        setNewSidebarIcon,
        handleCreateSidebar,
    }
}