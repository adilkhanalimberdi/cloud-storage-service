import type {FolderResponse} from "../../types/folder.ts";

interface BreadcrumbsProps {
    folderStack: FolderResponse[];
    navigateToBreadcrumb: (index: number) => void;
}

export function Breadcrumbs({ folderStack, navigateToBreadcrumb }: BreadcrumbsProps) {
    if (!folderStack || folderStack.length === 0) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 overflow-x-auto py-1">
            {folderStack.map((folder, index) => {
                const isLast = index === folderStack.length - 1;

                return (
                    <div key={folder.id || index} className="flex items-center gap-2 shrink-0">
                        {isLast ? (
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">{folder.name}</span>
                        ) : (
                            <button type="button"
                                    onClick={() => navigateToBreadcrumb(index)}
                                    className="hover:text-gray-900 dark:hover:text-zinc-100 hover:underline transition-colors">
                                {folder.name}
                            </button>
                        )}

                        {!isLast && <span className="text-gray-400 dark:text-zinc-600">/</span>}
                    </div>
                );
            })}
        </div>
    );
}