export function FileCard({ name, size, type }: { name: string; size: string; type: string }) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
            <span className="text-3xl">
              {type === 'code' ? '📄' : type === 'pdf' ? '📕' : '🖼️'}
            </span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200">⋮</button>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">{size}</p>
            </div>
        </div>
    );
}