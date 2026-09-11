import { useState, useRef, useEffect } from "react";
import { Download, EllipsisVertical, FolderInput, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { FileResponse } from "../../../types/file.ts";
import { iconMap } from "../../../utils/icon.utils.ts";
import { getFileSize } from "../../../utils/file.size.utils.ts";
import { FileService } from "../../../service/file.service.ts";
import { handleError } from "../../../utils/error.handler.ts";
import toast from "react-hot-toast";

interface FileCardProps {
    file: FileResponse;
    isTrashCan?: boolean;
    handleRenameFile?: (file: FileResponse) => void;
    handleDeleteFile?: (file: FileResponse) => void;
    handleDownloadFile?: (file: FileResponse) => void;
    handleMoveFile?: (file: FileResponse) => void;
    handleOpenFileDownloadUrl?: (file: FileResponse) => void;
    handleRestoreFile?: (file: FileResponse) => void;
    onRename?: (file: FileResponse) => void;
    onDelete?: (file: FileResponse) => void;
    onDownload?: (file: FileResponse) => void;
    onMove?: (file: FileResponse) => void;
    onRestore?: (file: FileResponse) => void;
    onClick?: (file: FileResponse) => void;
}

export function FileCard({
    file,
    isTrashCan,
    handleRenameFile,
    handleDeleteFile,
    handleDownloadFile,
    handleMoveFile,
    handleOpenFileDownloadUrl,
    handleRestoreFile,
    onRename,
    onDelete,
    onDownload,
    onMove,
    onRestore,
    onClick,
}: FileCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isInTrashCan = Boolean(isTrashCan ?? file.isTrashCan);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const onRenameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        if (handleRenameFile) {
            handleRenameFile(file);
        } else if (onRename) {
            onRename(file);
        }
    };

    const onDownloadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        if (handleDownloadFile) {
            handleDownloadFile(file);
        } else if (onDownload) {
            onDownload(file);
        } else if (handleOpenFileDownloadUrl) {
            handleOpenFileDownloadUrl(file);
        }
    };

    const onMoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        if (handleMoveFile) {
            handleMoveFile(file);
        } else if (onMove) {
            onMove(file);
        }
    };

    const onRestoreClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        if (handleRestoreFile) {
            handleRestoreFile(file);
        } else if (onRestore) {
            onRestore(file);
        } else {
            try {
                await FileService.restore(file.id);
                toast.success("File restored successfully!");
            } catch (err) {
                handleError(err as Error, "Failed to restore file.");
            }
        }
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        if (handleDeleteFile) {
            handleDeleteFile(file);
        } else if (onDelete) {
            onDelete(file);
        }
    };

    return (
        <div onClick={() => onClick?.(file)}
             className={`p-4 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl ${
                 onClick ? "cursor-pointer" : ""
             } transition-all flex flex-col justify-between h-32 ${
                 isOpen ? "relative z-30" : ""
             }`}>
            <div className="flex items-start justify-between">
                <span className="text-3xl">{iconMap[file.icon]}</span>
                <div className="relative" ref={menuRef}>
                    <button type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen((prev) => !prev);
                            }}
                            className={`text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 rounded-md transition-colors ${
                            isOpen ? "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100" : ""
                            }`}
                            title="File options">
                        <EllipsisVertical size={16} />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-8 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                             onClick={(e) => e.stopPropagation()}>
                            <button type="button"
                                    onClick={onRenameClick}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors text-left">
                                <Pencil size={15} className="text-blue-500" />
                                <span>Rename</span>
                            </button>

                            <button type="button"
                                    onClick={onDownloadClick}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors text-left">
                                <Download size={15} className="text-emerald-500" />
                                <span>Download</span>
                            </button>

                            {!isInTrashCan && (
                                <button type="button"
                                        onClick={onMoveClick}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors text-left">
                                    <FolderInput size={15} className="text-amber-500" />
                                    <span>Move</span>
                                </button>
                            )}

                            {isInTrashCan && (
                                <button type="button"
                                        onClick={onRestoreClick}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors text-left">
                                    <RotateCcw size={15} className="text-indigo-500" />
                                    <span>Restore</span>
                                </button>
                            )}

                            <div className="my-1 border-t border-gray-100 dark:border-zinc-800" />

                            <button type="button"
                                    onClick={onDeleteClick}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
                                <Trash2 size={15} className="text-red-500" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{file.name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">{getFileSize(file.size)}</p>
            </div>
        </div>
    );
}
