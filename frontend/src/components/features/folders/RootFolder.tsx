import type {FolderResponse} from "../../../types/folder.ts";
import {iconMap} from "../../../utils/icon.utils.ts";

interface RootFolderProps {
    folder: FolderResponse,
    active: boolean
    onClick: () => void,
}

export function RootFolder({ folder, active = false, onClick }: RootFolderProps) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60'}`}
                onClick={onClick}>
            <span className="text-base">{iconMap[folder.icon]}</span>
            <span>{folder.name}</span>
        </button>
    );
}