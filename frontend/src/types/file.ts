import type {FileIcon} from "../utils/icon.utils.ts";

export type RenameFileRequest = {
    fileName: string;
}

export type FileCreateRequest = {
    fileName: string;
    content: string;
}

export type FileResponse = {
    id: string;
    name: string;
    originalName: string;
    extension: string;
    contentType: string;
    size: bigint;
    icon: FileIcon;
    updatedAt: Date;
    createdAt: Date;
}