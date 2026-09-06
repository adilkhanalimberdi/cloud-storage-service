import {EllipsisVertical} from "lucide-react";
import type {FileResponse} from "../../../types/file.ts";
import {iconMap} from "../../../utils/icon.utils.ts";
import {getFileSize} from "../../../utils/file.size.utils.ts";

interface FileCardProps {
    file: FileResponse;
}

export function FileCard({ file }: FileCardProps) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
                <span className="text-3xl">{iconMap[file.icon]}</span>
                <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 rounded-md">
                    <EllipsisVertical size={16} />
                </button>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{file.name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">{getFileSize(file.size)}</p>
            </div>
        </div>
    );
}