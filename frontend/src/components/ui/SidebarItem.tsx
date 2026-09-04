export function SidebarItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            active
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60'}`}>
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </button>
    );
}