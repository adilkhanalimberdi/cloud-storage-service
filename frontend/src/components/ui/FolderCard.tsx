export function FolderCard({ name, itemsCount }: { name: string; itemsCount: string }) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl cursor-pointer transition-all flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">📁</span>
            <div className="truncate">
                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">{itemsCount}</p>
            </div>
        </div>
    );
}