import type {FolderIcon} from "../utils/icon.utils.ts";
import type {FileResponse} from "./file.ts";

export type FolderResponse = {
    id: string;
    name: string;
    icon: FolderIcon;
    isRoot: boolean;
    subfolders: FolderResponse[];
    files: FileResponse[];
    createdAt: Date;
}

export type FolderCreateRequest = {
    name: string;
    icon: FolderIcon;
    parentId: string | null;
}