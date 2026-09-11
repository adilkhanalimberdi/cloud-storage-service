import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/Modal.tsx";
import { Button } from "../../ui/Button.tsx";
import type { FileResponse } from "../../../types/file.ts";
import type { FolderResponse } from "../../../types/folder.ts";
import { FolderService } from "../../../service/folder.service.ts";
import { iconMap } from "../../../utils/icon.utils.ts";
import { ChevronRight, ArrowLeft, Check } from "lucide-react";
import { handleError } from "../../../utils/error.handler.ts";

interface FileMoveModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: FileResponse | null;
    currentFolderId?: string;
    onSubmit: (targetFolderId: string) => Promise<boolean | void> | void;
    isLoading?: boolean;
}

export const FileMoveModal: React.FC<FileMoveModalProps> = ({
    isOpen,
    onClose,
    file,
    currentFolderId,
    onSubmit,
    isLoading = false,
}) => {
    const [rootFolders, setRootFolders] = useState<FolderResponse[]>([]);
    const [folderStack, setFolderStack] = useState<FolderResponse[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<FolderResponse | null>(null);
    const [isLoadingFolders, setIsLoadingFolders] = useState<boolean>(false);

    const currentBrowseFolder = folderStack.length > 0 ? folderStack[folderStack.length - 1] : null;

    useEffect(() => {
        if (!isOpen) return;

        let ignore = false;
        queueMicrotask(() => {
            if (!ignore) {
                setIsLoadingFolders(true);
                setFolderStack([]);
                setSelectedFolder(null);
            }
        });

        FolderService.getAllRoot()
            .then((roots) => {
                if (!ignore) {
                    const available = (roots || []).filter((f) => !f.isTrashCan);
                    setRootFolders(available);
                }
            })
            .catch((err) => {
                if (!ignore) {
                    handleError(err as Error, "Failed to load folders.");
                }
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoadingFolders(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [isOpen]);

    if (!isOpen || !file) return null;

    const displayedFolders = currentBrowseFolder
        ? (currentBrowseFolder.subfolders || []).filter((f) => !f.isTrashCan)
        : rootFolders;

    const handleEnterFolder = async (folder: FolderResponse) => {
        setSelectedFolder(folder);
        try {
            const fresh = await FolderService.getById(folder.id);
            setFolderStack((prev) => [...prev, fresh]);
            setSelectedFolder(fresh);
        } catch (err) {
            handleError(err as Error, "Failed to open folder.");
        }
    };

    const handleNavigateUp = () => {
        if (folderStack.length <= 1) {
            setFolderStack([]);
            setSelectedFolder(null);
        } else {
            const updated = folderStack.slice(0, -1);
            setFolderStack(updated);
            setSelectedFolder(updated[updated.length - 1]);
        }
    };

    const handleBreadcrumbClick = async (index: number) => {
        if (index === -1) {
            setFolderStack([]);
            setSelectedFolder(null);
        } else {
            const targetFolder = folderStack[index];
            const updated = folderStack.slice(0, index + 1);
            setFolderStack(updated);
            setSelectedFolder(targetFolder);
        }
    };

    const isCurrentFolderSelected = selectedFolder?.id === currentFolderId;
    const canSubmit = selectedFolder !== null && !isCurrentFolderSelected && !isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFolder || isCurrentFolderSelected || isLoading) return;
        await onSubmit(selectedFolder.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Move "${file.name}"`} maxWidth="lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Current breadcrumb location */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => handleBreadcrumbClick(-1)}
                        className={`hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors ${
                            folderStack.length === 0 ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                        }`}
                    >
                        Root
                    </button>
                    {folderStack.map((folder, index) => {
                        const isLast = index === folderStack.length - 1;
                        return (
                            <React.Fragment key={folder.id}>
                                <ChevronRight size={14} className="text-gray-400 shrink-0" />
                                <button
                                    type="button"
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className={`hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[120px] transition-colors ${
                                        isLast ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                                    }`}
                                >
                                    {folder.name}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Back button if drilled in */}
                {folderStack.length > 0 && (
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleNavigateUp}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            <span>Back</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => currentBrowseFolder && setSelectedFolder(currentBrowseFolder)}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                                selectedFolder?.id === currentBrowseFolder?.id
                                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                                    : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                            }`}
                        >
                            {selectedFolder?.id === currentBrowseFolder?.id && <Check size={12} />}
                            <span>Select current folder</span>
                        </button>
                    </div>
                )}

                {/* Folder List */}
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/60">
                    {isLoadingFolders ? (
                        <div className="p-6 text-center text-sm text-gray-400 dark:text-zinc-500">
                            Loading folders...
                        </div>
                    ) : displayedFolders.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400 dark:text-zinc-500">
                            No subfolders available in this folder.
                        </div>
                    ) : (
                        displayedFolders.map((folder) => {
                            const isSelected = selectedFolder?.id === folder.id;
                            const isCurrentFileFolder = folder.id === currentFolderId;

                            return (
                                <div
                                    key={folder.id}
                                    onClick={() => setSelectedFolder(folder)}
                                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                                        isSelected
                                            ? "bg-blue-50 dark:bg-blue-950/40"
                                            : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xl shrink-0">{iconMap[folder.icon] ?? "📁"}</span>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium truncate ${
                                                isSelected
                                                    ? "text-blue-700 dark:text-blue-300"
                                                    : "text-gray-800 dark:text-zinc-200"
                                            }`}>
                                                {folder.name}
                                            </p>
                                            {isCurrentFileFolder && (
                                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                                    Current folder of file
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEnterFolder(folder);
                                            }}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/70 dark:hover:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                            title="Open folder"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Selected Destination Notice */}
                <div className="text-xs">
                    {selectedFolder ? (
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300">
                            <span className="text-gray-500 dark:text-zinc-400">Destination:</span>
                            <span className="font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-1">
                                <span>{iconMap[selectedFolder.icon] ?? "📁"}</span>
                                {selectedFolder.name}
                            </span>
                            {isCurrentFolderSelected && (
                                <span className="text-amber-600 dark:text-amber-400 font-medium ml-1">
                                    (File is already here)
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-zinc-500">
                            Click a folder to select it as the destination.
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!canSubmit}
                    >
                        {isLoading ? "Moving..." : "Move"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
