import {useState} from "react";
import {FileService} from "../service/file.service.ts";
import {handleError} from "../utils/error.handler.ts";
import toast from "react-hot-toast";
import {validate} from "../utils/file.size.utils.ts";
import type {FileResponse} from "../types/file.ts";

export const useFiles = () => {
    const [newFileName, setNewFileName] = useState<string>("");
    const [newFileContent, setNewFileContent] = useState<string>("");
    const [isFileCreating, setIsFileCreating] = useState<boolean>(false);

    const [editFileName, setEditFileName] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isFileRenaming, setIsFileRenaming] = useState<boolean>(false);
    const [renamingFile, setRenamingFile] = useState<FileResponse | null>(null);

    const openRenameModal = (file: FileResponse) => {
        setRenamingFile(file);
        setEditFileName(file.name);
        setIsFileRenaming(true);
    };

    const closeRenameModal = () => {
        setIsFileRenaming(false);
        setRenamingFile(null);
        setEditFileName("");
    };

    const handleOpenFileDownloadUrl = async (fileId: string) => {
        try {
            const downloadUrl = await FileService.getDownloadUrl(fileId);
            window.open(downloadUrl.url, "_blank");
        } catch (error) {
            handleError(error as Error, "Failed to get file download URL.");
        }
    };

    const handleCreateFile = async (folderId: string | undefined, refetch: () => void) => {
        if (!folderId) return;
        try {
            await FileService.create(newFileName, newFileContent, folderId);
            refetch();
            setIsFileCreating(false);
            toast.success("File created successfully!");
        } catch (err) {
            handleError(err as Error, "Failed to create file.");
        }
    }

    const handleUploadFiles = async (files: FileList, folderId: string, refetch: () => void) => {
        const uploadedFiles: File[] = Array.from(files);
        if (!uploadedFiles || uploadedFiles.length === 0) return;
        if (!folderId || folderId.trim().length === 0) return;

        const validateMessage = validate(uploadedFiles);
        if (validateMessage) {
            toast.error(validateMessage);
            return;
        }

        try {
            await FileService.upload(uploadedFiles, folderId);
            refetch();
            toast.success("Files uploaded successfully!");
        } catch (err) {
            handleError(err as Error, "Failed to upload files.");
        }
    };

    const handleRenameFile = async (fileId?: string, refetch?: () => void, customName?: string) => {
        const targetId = fileId ?? renamingFile?.id;
        if (!targetId) return;

        let targetName = (customName !== undefined ? customName : editFileName).trim();
        if (!targetName) {
            const promptName = window.prompt("Enter new file name:");
            if (!promptName || !promptName.trim()) return;
            targetName = promptName.trim();
        }

        setIsEditing(true);
        try {
            await FileService.rename(targetId, targetName);
            if (refetch) refetch();
            closeRenameModal();
            toast.success("File renamed successfully!");
        } catch (err) {
            handleError(err as Error, "Failed to rename file.");
        } finally {
            setIsEditing(false);
        }
    }

    const [isFileDeleting, setIsFileDeleting] = useState<boolean>(false);
    const [deletingFile, setDeletingFile] = useState<FileResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const openDeleteModal = (file: FileResponse) => {
        setDeletingFile(file);
        setIsFileDeleting(true);
    };

    const closeDeleteModal = () => {
        setIsFileDeleting(false);
        setDeletingFile(null);
    };

    const handleDeleteFile = async (
        fileId?: string,
        isTrashCanOrRefetch?: boolean | (() => void),
        maybeRefetch?: () => void
    ) => {
        let isTrashCan = false;
        let refetch: (() => void) | undefined = undefined;

        if (typeof isTrashCanOrRefetch === "boolean") {
            isTrashCan = isTrashCanOrRefetch;
            refetch = maybeRefetch;
        } else if (typeof isTrashCanOrRefetch === "function") {
            refetch = isTrashCanOrRefetch;
        }

        const targetId = fileId ?? deletingFile?.id;
        if (!targetId) return;

        setIsDeleting(true);
        try {
            if (isTrashCan) {
                await FileService.delete(targetId);
                toast.success("File deleted successfully!");
            } else {
                await FileService.softDelete(targetId);
                toast.success("File moved to trash!");
            }
            if (refetch) await refetch();
            closeDeleteModal();
        } catch (err) {
            handleError(
                err as Error,
                isTrashCan ? "Failed to delete file." : "Failed to move file to trash."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const clearFileCreateForm = () => {
        setNewFileName("");
        setNewFileContent("");
    }

    const clearFileRenameForm = () => {
        setEditFileName("");
    }

    return {
        newFileName,
        setNewFileName,
        newFileContent,
        setNewFileContent,
        isFileCreating,
        setIsFileCreating,
        clearFileCreateForm,

        editFileName,
        setEditFileName,
        isEditing,
        setIsEditing,
        isFileRenaming,
        setIsFileRenaming,
        renamingFile,
        openRenameModal,
        closeRenameModal,
        clearFileRenameForm,

        isFileDeleting,
        setIsFileDeleting,
        deletingFile,
        isDeleting,
        openDeleteModal,
        closeDeleteModal,

        handleUploadFiles,
        handleCreateFile,
        handleRenameFile,
        handleDeleteFile,
        handleOpenFileDownloadUrl
    }
}