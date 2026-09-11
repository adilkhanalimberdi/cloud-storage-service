import React from "react";
import { Modal } from "../../ui/Modal.tsx";
import { Button } from "../../ui/Button.tsx";
import type { FolderResponse } from "../../../types/folder.ts";
import { AlertTriangle } from "lucide-react";

interface FolderDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    folder: FolderResponse | null;
    onSubmit?: () => void;
    isLoading?: boolean;
}

export const FolderDeleteModal: React.FC<FolderDeleteModalProps> = ({
    isOpen,
    onClose,
    folder,
    onSubmit,
    isLoading = false,
}) => {
    if (!folder) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Folder">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl shrink-0 bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-zinc-300">
                        <p>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-gray-900 dark:text-zinc-100">
                                "{folder.name}"
                            </span>
                            ? This action will delete the folder and all its contents.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <Button type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="button"
                            variant="danger"
                            onClick={onSubmit}
                            disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
