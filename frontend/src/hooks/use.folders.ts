import { useCallback, useEffect, useRef, useState } from "react";
import { handleError } from "../utils/error.handler.ts";
import toast from "react-hot-toast";
import type { FolderResponse } from "../types/folder.ts";
import type { FolderIcon } from "../utils/icon.utils.ts";
import { FolderService } from "../service/folder.service.ts";

const DEFAULT_FETCH_ERROR_MESSAGE = "Failed to fetch folders.";

export const useFolders = () => {
    const [folders, setFolders] = useState<FolderResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newFolderName, setNewFolderName] = useState<string>("");
    const [newFolderIcon, setNewFolderIcon] = useState<FolderIcon>("DEFAULT");
    const [parentId, setParentId] = useState<string | null>(null);
    const [isSubfolderCreating, setIsSubfolderCreating] = useState<boolean>(false);

    const [isRootFolderCreating, setIsRootFolderCreating] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isDeletingFolder, setIsDeletingFolder] = useState<boolean>(false);

    const [activeRootFolder, setActiveRootFolder] = useState<FolderResponse | null>(null);
    const [currentFolder, setCurrentFolder] = useState<FolderResponse | null>(null);
    const [folderStack, setFolderStack] = useState<FolderResponse[]>([]);

    const currentFolderRef = useRef<FolderResponse | null>(null);
    const activeRootFolderRef = useRef<FolderResponse | null>(null);

    useEffect(() => {
        currentFolderRef.current = currentFolder;
        activeRootFolderRef.current = activeRootFolder;
    }, [currentFolder, activeRootFolder]);

    const clearFolderCreateForm = () => {
        setNewFolderName("");
        setNewFolderIcon("DEFAULT");
        setIsSubfolderCreating(false);
    };

    const refetchRootFolders = useCallback(async () => {
        try {
            const data = await FolderService.getAllRoot();
            setFolders(data);
            return data;
        } catch (err) {
            handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
            return null;
        }
    }, []);

    const selectRootFolder = useCallback(async (folder: FolderResponse | null) => {
        setActiveRootFolder(folder);
        setCurrentFolder(folder);
        if (folder) {
            setFolderStack([folder]);
            setParentId(folder.id);
            try {
                const freshFolder = await FolderService.getById(folder.id);
                setCurrentFolder(freshFolder);
                setActiveRootFolder(freshFolder);
                setFolderStack([freshFolder]);
                setFolders((prev) =>
                    prev ? prev.map((f) => (f.id === freshFolder.id ? freshFolder : f)) : [freshFolder]
                );
            } catch (err) {
                console.error(err);
            }
        } else {
            setFolderStack([]);
            setParentId(null);
        }
    }, []);

    const refreshCurrentFolder = useCallback(async () => {
        const targetId = currentFolderRef.current?.id;
        if (!targetId) return;

        try {
            const freshFolder = await FolderService.getById(targetId);

            setCurrentFolder(freshFolder);

            setFolderStack((prevStack) => {
                if (prevStack.length === 0) return [freshFolder];
                const updated = [...prevStack];
                updated[updated.length - 1] = freshFolder;
                return updated;
            });

            if (freshFolder.isRoot) {
                setActiveRootFolder(freshFolder);
                setFolders((prev) =>
                    prev ? prev.map((f) => (f.id === freshFolder.id ? freshFolder : f)) : [freshFolder]
                );
            }
        } catch (err) {
            console.error(err);
            const rootData = await refetchRootFolders();
            if (rootData && activeRootFolderRef.current) {
                const freshRoot = rootData.find((f) => f.id === activeRootFolderRef.current?.id);
                if (freshRoot) {
                    setActiveRootFolder(freshRoot);
                }
            }
        }
    }, [refetchRootFolders]);

    const refetchAll = useCallback(async () => {
        await Promise.all([
            refreshCurrentFolder(),
            refetchRootFolders(),
        ]);
    }, [refreshCurrentFolder, refetchRootFolders]);

    const navigateToSubfolder = async (subfolder: FolderResponse) => {
        setCurrentFolder(subfolder);
        setFolderStack((prev) => [...prev, subfolder]);
        setParentId(subfolder.id);
        try {
            const freshFolder = await FolderService.getById(subfolder.id);
            setCurrentFolder(freshFolder);
            setFolderStack((prev) => {
                if (prev.length === 0) return [freshFolder];
                const updated = [...prev];
                updated[updated.length - 1] = freshFolder;
                return updated;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const navigateToBreadcrumb = async (index: number) => {
        const targetFolder = folderStack[index];
        if (!targetFolder) return;

        const updatedStack = folderStack.slice(0, index + 1);
        setFolderStack(updatedStack);
        setCurrentFolder(targetFolder);
        setParentId(targetFolder.id);
        try {
            const freshFolder = await FolderService.getById(targetFolder.id);
            setCurrentFolder(freshFolder);
            setFolderStack((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = freshFolder;
                return copy;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const navigateUp = async () => {
        if (folderStack.length <= 1) return;

        const updatedStack = folderStack.slice(0, -1);
        const previousFolder = updatedStack[updatedStack.length - 1];

        setFolderStack(updatedStack);
        setCurrentFolder(previousFolder);
        setParentId(previousFolder.id);
        try {
            const freshFolder = await FolderService.getById(previousFolder.id);
            setCurrentFolder(freshFolder);
            setFolderStack((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = freshFolder;
                return copy;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateRootFolder = async () => {
        if (!newFolderName.trim()) return;
        setIsRootFolderCreating(true);
        try {
            await FolderService.create(newFolderName, newFolderIcon, null);
            await refetchRootFolders();
            toast.success("Root folder created successfully!");
            clearFolderCreateForm();
        } catch (err) {
            handleError(err as Error, "Failed to create root folder.");
        } finally {
            setIsRootFolderCreating(false);
        }
    };

    const handleCreateFolder = async (targetParentId?: string) => {
        if (!newFolderName.trim()) return;

        const validTargetId = typeof targetParentId === "string" ? targetParentId : null;
        const effectiveParentId = validTargetId ?? parentId ?? currentFolder?.id ?? null;

        setIsCreating(true);
        try {
            await FolderService.create(newFolderName, newFolderIcon, effectiveParentId);
            await refreshCurrentFolder();
            await refetchRootFolders();

            toast.success("Folder created successfully!");
            clearFolderCreateForm();
        } catch (err) {
            handleError(err as Error, "Failed to create folder.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteFolder = async (folderId?: string): Promise<boolean> => {
        const targetId = folderId ?? currentFolder?.id;
        if (!targetId) return false;

        setIsDeletingFolder(true);
        try {
            await FolderService.delete(targetId);
            toast.success("Folder deleted successfully!");

            if (currentFolder?.id === targetId) {
                if (folderStack.length > 1) {
                    const updatedStack = folderStack.slice(0, -1);
                    const parentFolder = updatedStack[updatedStack.length - 1];

                    setFolderStack(updatedStack);
                    setCurrentFolder(parentFolder);
                    setParentId(parentFolder.id);

                    try {
                        const freshParent = await FolderService.getById(parentFolder.id);
                        setCurrentFolder(freshParent);
                        setFolderStack((prev) => {
                            if (prev.length === 0) return [freshParent];
                            const copy = [...prev];
                            copy[copy.length - 1] = freshParent;
                            return copy;
                        });

                        if (freshParent.isRoot) {
                            setActiveRootFolder(freshParent);
                            setFolders((prev) =>
                                prev ? prev.map((f) => (f.id === freshParent.id ? freshParent : f)) : [freshParent]
                            );
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    await refetchRootFolders();
                } else {
                    const freshRoots = await refetchRootFolders();
                    const remainingRoots = freshRoots?.filter((f) => f.id !== targetId) ?? [];
                    if (remainingRoots.length > 0) {
                        await selectRootFolder(remainingRoots[0]);
                    } else {
                        setActiveRootFolder(null);
                        setCurrentFolder(null);
                        setFolderStack([]);
                        setParentId(null);
                        setFolders([]);
                    }
                }
            } else {
                await refreshCurrentFolder();
                await refetchRootFolders();
            }
            return true;
        } catch (err) {
            handleError(err as Error, "Failed to delete folder.");
            return false;
        } finally {
            setIsDeletingFolder(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        const loadInitialData = async () => {
            try {
                const data = await FolderService.getAllRoot();
                if (!ignore) {
                    setFolders(data);
                    if (data && data.length > 0) {
                        const initial = data[0];
                        setActiveRootFolder(initial);
                        setCurrentFolder(initial);
                        setFolderStack([initial]);
                        setParentId(initial.id);
                    }
                }
            } catch (err) {
                if (!ignore) {
                    handleError(err as Error, DEFAULT_FETCH_ERROR_MESSAGE);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialData().then();

        return () => {
            ignore = true;
        };
    }, []);

    return {
        folders,
        setFolders,
        activeRootFolder,
        selectRootFolder,
        currentFolder,
        subfolders: currentFolder?.subfolders ?? [],
        folderStack,

        isLoading,
        isRootFolderCreating,
        isCreating,
        isDeletingFolder,

        newFolderName,
        setNewFolderName,
        newFolderIcon,
        setNewFolderIcon,
        parentId,
        setParentId,
        isSubfolderCreating,
        setIsSubfolderCreating,
        clearFolderCreateForm,

        refetch: refetchAll,
        refetchAll,
        refetchRootFolders,
        refreshCurrentFolder,
        handleCreateRootFolder,
        handleCreateFolder,
        handleDeleteFolder,
        navigateToSubfolder,
        navigateToBreadcrumb,
        navigateUp,
    };
};