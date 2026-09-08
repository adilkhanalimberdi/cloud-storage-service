import {useState} from "react";
import {FileService} from "../service/file.service.ts";
import {handleError} from "../utils/error.handler.ts";
import toast from "react-hot-toast";
import {validate} from "../utils/file.size.utils.ts";

export const useFiles = () => {
    const [newFileName, setNewFileName] = useState<string>("");
    const [newFileContent, setNewFileContent] = useState<string>("");
    const [isFileCreating, setIsFileCreating] = useState<boolean>(false);

    const [editFileName, setEditFileName] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

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

    const handleRenameFile = async (fileId: string, refetch: () => void) => {
        setIsEditing(true);
        try {
            await FileService.rename(fileId, editFileName);
            refetch();
            toast.success("File renamed successfully!");
        } catch (err) {
            handleError(err as Error, "Failed to rename file.");
        } finally {
            setIsEditing(false);
        }
    }

    const handleDeleteFile = async (fileId: string, refetch: () => void) => {
        try {
            await FileService.delete(fileId);
            refetch();
            toast.success("File deleted successfully!");
        } catch (err) {
            handleError(err as Error, "Failed to delete file.");
        }
    }

    const clearFileCreateForm = () => {
        setNewFileName("");
        setNewFileContent("");
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

        handleUploadFiles,
        handleCreateFile,
        handleRenameFile,
        handleDeleteFile,
    }
}