import React from "react";
import { Modal } from "../../ui/Modal.tsx";
import { Input } from "../../ui/Input.tsx";
import { Button } from "../../ui/Button.tsx";

interface FileRenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    setFileName: (val: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export const FileRenameModal: React.FC<FileRenameModalProps> = ({
    isOpen,
    onClose,
    fileName,
    setFileName,
    onSubmit,
    isLoading,
}) => {
    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!fileName.trim() || isLoading) return;
        onSubmit();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rename File">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                    label="File Name"
                    placeholder="e.g. document.txt"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    autoFocus
                />

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
                        disabled={!fileName.trim() || isLoading}
                    >
                        {isLoading ? "Saving..." : "Rename"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
