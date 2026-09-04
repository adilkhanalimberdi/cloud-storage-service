import type {FileIcon} from "../utils/icon.utils.ts";

export type FileResponse = {
    id: string;
    name: string;
    icon: FileIcon;
    type: string;
    size: bigint;
    updatedAt: Date;
    createdAt: Date;
}