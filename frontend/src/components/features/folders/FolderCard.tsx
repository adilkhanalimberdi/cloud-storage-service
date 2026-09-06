import {iconMap} from "../../../utils/icon.utils.ts";
import type {FolderResponse} from "../../../types/folder.ts";

interface FolderCardProps {
    folder: FolderResponse;
    onClick?: () => void,
}

export function FolderCard({folder, onClick}: FolderCardProps) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
             onClick={onClick}>
            <span className="text-2xl group-hover:scale-110 transition-transform">
                {iconMap[folder.icon]}
            </span>
            <div className="truncate">
                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{folder.name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                    {(folder.files.length + folder.subfolders.length) === 0 ? 'Empty' : (folder.files.length + folder.subfolders.length) === 1 ? '1 item' : `${folder.files.length + folder.subfolders.length} items`}
                </p>
            </div>
        </div>
    );
}