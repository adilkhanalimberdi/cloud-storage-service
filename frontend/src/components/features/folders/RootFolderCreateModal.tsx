import React from "react";
import { Modal } from "../../ui/Modal.tsx";
import { Input } from "../../ui/Input.tsx";
import { Button } from "../../ui/Button.tsx";
import { type FolderIcon, iconMap } from "../../../utils/icon.utils.ts";

interface RootFolderCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    folderName: string;
    setFolderName: (val: string) => void;
    folderIcon: FolderIcon;
    setFolderIcon: (icon: FolderIcon) => void;
    onSubmit?: () => void;
    isLoading?: boolean;
}

const AVAILABLE_ICONS: { value: FolderIcon; label: string }[] = [
    { value: "DEFAULT", label: "Default Folder" },
    { value: "HARD_DRIVE", label: "System Drive" },
    { value: "USERS", label: "Shared / Team" },
    { value: "CLOCK", label: "Recent / Archive" },
    { value: "STAR", label: "Starred" },
];

export const RootFolderCreateModal: React.FC<RootFolderCreateModalProps> = ({
    isOpen,
    onClose,
    folderName,
    setFolderName,
    folderIcon,
    setFolderIcon,
    onSubmit,
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Root Folder">
            <div className="flex flex-col gap-5">
                <Input label="Folder Name"
                       placeholder="e.g. My Projects"
                       value={folderName}
                       onChange={(e) => setFolderName(e.target.value)}
                       autoFocus />

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-zinc-400">
                        Select Icon
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_ICONS.map((item) => {
                            const isSelected = folderIcon === item.value;
                            return (
                                <button key={item.value}
                                        type="button"
                                        onClick={() => setFolderIcon(item.value)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${
                                            isSelected
                                                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-medium"
                                                : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-300"
                                        }`}>
                                    <span className="text-xl">{iconMap[item.value]}</span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2">
                    <Button type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}>Cancel</Button>
                    <Button type="button"
                            variant="primary"
                            onClick={onSubmit}
                            disabled={!folderName.trim() || isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
