import {Header} from "../components/ui/Header.tsx";
import {RootFolder} from "../components/ui/RootFolder.tsx";
import {FolderCard} from "../components/ui/FolderCard.tsx";
import {FileCard} from "../components/ui/FileCard.tsx";
import {iconMap} from "../utils/icon.utils.ts";
import {useFolders} from "../hooks/use.folders.ts";
import {Button} from "../components/ui/Button.tsx";
import type {FolderResponse} from "../types/folder.ts";
import {LayoutGrid, LayoutList, Plus} from "lucide-react";
import {CustomToaster} from "../components/ui/CustomToaster.tsx";
import {Breadcrumbs} from "../components/ui/BreadCrumbs.tsx";
import type {FileResponse} from "../types/file.ts";
import {getFileSize} from "../utils/file.size.utils.ts";
import {useStorage} from "../hooks/use.storage.ts";

function HomePage() {
    const {
        usedSpaceFormatted,
        totalSpaceFormatted,
        percentage
    } = useStorage();

    const {
        activeRootFolder,
        folders,
        currentFolder,
        subfolders,
        folderStack,
        selectRootFolder,
        navigateToSubfolder,
        navigateToBreadcrumb,
        isRootFolderCreating,
        handleCreateRootFolder
    } = useFolders();

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <CustomToaster />

            <Header />

            <div className="flex flex-1 overflow-hidden">

                <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
                    <div className="space-y-6">
                        <Button children={<Plus size={16} />}
                                variant="primary"
                                className="w-full py-3 flex items-center justify-center"
                                onClick={handleCreateRootFolder}
                                disabled={isRootFolderCreating} />

                        <nav className="space-y-1">
                            {folders != null && folders.map((item: FolderResponse) => (
                                <RootFolder icon={iconMap[item.icon]}
                                            label={item.name}
                                            key={item.id}
                                            active={activeRootFolder?.id === item.id}
                                            onClick={() => selectRootFolder(item)} />
                            ))}
                        </nav>
                    </div>

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
                </aside>

                <main
                    className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-zinc-900 m-0 md:m-2 md:rounded-2xl border border-transparent md:border-gray-200 md:dark:border-zinc-800 shadow-sm">

                    <div
                        className="h-14 border-b border-gray-100 dark:border-zinc-800/80 px-6 flex items-center justify-between gap-4">
                        <Breadcrumbs folderStack={folderStack} navigateToBreadcrumb={navigateToBreadcrumb} />

                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                <LayoutGrid size={16} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                <LayoutList size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">

                        {subfolders.length > 0 && (
                            <section className="mb-8">
                                <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
                                    Folders
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {subfolders.map((folder: FolderResponse) => (
                                        <FolderCard name={folder.name}
                                                    icon={folder.icon}
                                                    key={folder.id}
                                                    onClick={() => navigateToSubfolder(folder)} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {currentFolder?.files && currentFolder.files.length > 0 && (
                            <section>
                                <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
                                    Files
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {currentFolder?.files.map((file: FileResponse) => (
                                        <FileCard name={file.name}
                                                  size={getFileSize(file.size)}
                                                  type={file.type}
                                                  key={file.id} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomePage;
