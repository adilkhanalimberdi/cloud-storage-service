import {useStorage} from "../../../hooks/use.storage.ts";

export function StorageWidget() {
    const {
        usedSpaceFormatted,
        totalSpaceFormatted,
        percentage
    } = useStorage();

    return (
        <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
                <span>Storage</span>
                <span>{usedSpaceFormatted} of {totalSpaceFormatted} used</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                     style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}