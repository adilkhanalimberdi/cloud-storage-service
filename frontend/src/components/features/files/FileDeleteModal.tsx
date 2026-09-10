import React from "react";
import { Modal } from "../../ui/Modal.tsx";
import { Button } from "../../ui/Button.tsx";
import type { FileResponse } from "../../../types/file.ts";
import { AlertTriangle } from "lucide-react";

interface FileDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: FileResponse | null;
    isTrashCan?: boolean;
    onSubmit: () => void;
    isLoading?: boolean;
}

export const FileDeleteModal: React.FC<FileDeleteModalProps> = ({
    isOpen,
    onClose,
    file,
    isTrashCan = false,
    onSubmit,
    isLoading = false,
}) => {
    if (!file) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete File">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                    <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                            isTrashCan
                                ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                : "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                    >
                        <AlertTriangle size={20} />
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-zinc-300">
                        {isTrashCan ? (
                            <p>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                                    "{file.name}"
                                </span>
                                ? This action cannot be undone.
                            </p>
                        ) : (
                            <p>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                                    "{file.name}"
                                </span>
                                ?
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
