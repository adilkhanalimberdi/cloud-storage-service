import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Plus, FolderPlus, Upload, FileText } from "lucide-react";

interface CreateMenuProps {
    onOpenCreateFolderModal: () => void;
    onOpenCreateTxtModal: () => void;
    onUploadFiles: (files: FileList, currentFolderId: string, refetch: () => void) => void;
    currentFolderId: string;
    refetch: () => void;
}

export function CreateMenu({onOpenCreateFolderModal, onOpenCreateTxtModal, onUploadFiles, currentFolderId, refetch}: CreateMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUploadFiles(e.target.files, currentFolderId, refetch);
            setIsOpen(false);
            e.target.value = "";
        }
    };

    return (
        <div className="relative inline-block" ref={menuRef}>
            <input type="file"
                   ref={fileInputRef}
                   className="hidden"
                   multiple
                   onChange={handleFileChange} />

            <button type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`p-2 rounded-lg transition-colors ${
                        isOpen
                            ? "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100"
                            : "hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300"
                        }`}
                    title="Create or upload">
                <Plus size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                     onClick={(e) => e.stopPropagation()}>
                    <button type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onOpenCreateFolderModal();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors">
                        <FolderPlus size={16} className="text-blue-500" />
                        <span>New folder</span>
                    </button>

                    <div className="my-1 border-t border-gray-100 dark:border-zinc-800" />

                    <button type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors">
                        <Upload size={16} className="text-emerald-500" />
                        <span>Upload file</span>
                    </button>

                    <button type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onOpenCreateTxtModal();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors">
                        <FileText size={16} className="text-amber-500" />
                        <span>Text document (.txt)</span>
                    </button>
                </div>
            )}
        </div>
    );
}