import {Header} from "../components/layout/Header.tsx";
import {RootFolder} from "../components/features/folders/RootFolder.tsx";
import {FolderCard} from "../components/features/folders/FolderCard.tsx";
import {FileCard} from "../components/features/files/FileCard.tsx";
import {useFolders} from "../hooks/use.folders.ts";
import {Button} from "../components/ui/Button.tsx";
import type {FolderResponse} from "../types/folder.ts";
import {LayoutGrid, LayoutList, Pencil, Plus, Trash} from "lucide-react";
import {CustomToaster} from "../components/ui/CustomToaster.tsx";
import {Breadcrumbs} from "../components/layout/BreadCrumbs.tsx";
import type {FileResponse} from "../types/file.ts";
import {CreateMenu} from "../components/ui/CreateMenu.tsx";
import {StorageWidget} from "../components/features/storage/StorageWidget.tsx";
import {FolderCreateModal} from "../components/features/folders/FolderCreateModal.tsx";
import {FileCreateModal} from "../components/features/files/FileCreateModal.tsx";
import {useFiles} from "../hooks/use.files.ts";

function HomePage() {
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
        handleCreateRootFolder,

        isCreating,
        newFolderName,
        setNewFolderName,
        newFolderIcon,
        setNewFolderIcon,
        isSubfolderCreating,
        setIsSubfolderCreating,
        handleCreateFolder,
        clearFolderCreateForm,

        refetch,
    } = useFolders();

    const {
        newFileName,
        setNewFileName,
        newFileContent,
        setNewFileContent,
        isFileCreating,
        setIsFileCreating,
        clearFileCreateForm,

        handleUploadFiles,
        handleCreateFile,
    } = useFiles();

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <Header />

            <div className="flex flex-1 overflow-hidden">

                <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
                    <div className="space-y-6">
                        <Button variant="primary"
                                className="w-full py-3 flex items-center justify-center"
                                onClick={handleCreateRootFolder}
                                disabled={isRootFolderCreating}>
                            <Plus size={16} />
                        </Button>

                        <nav className="space-y-1">
                            {folders != null && folders.map((folder: FolderResponse) => (
                                <RootFolder folder={folder}
                                            key={folder.id}
                                            active={activeRootFolder?.id === folder.id}
                                            onClick={() => selectRootFolder(folder)} />
                            ))}
                        </nav>
                    </div>

                    <StorageWidget />
                </aside>

                <main
                    className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-zinc-900 m-0 md:m-2 md:rounded-2xl border border-transparent md:border-gray-200 md:dark:border-zinc-800 shadow-sm">

                    <div className="h-14 border-b border-gray-100 dark:border-zinc-800/80 px-6 flex items-center justify-between gap-4">
                        <Breadcrumbs folderStack={folderStack} navigateToBreadcrumb={navigateToBreadcrumb} />

                        {currentFolder && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                        <Trash size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                        <Pencil size={16} />
                                    </button>
                                    <CreateMenu onOpenCreateFolderModal={() => setIsSubfolderCreating(true)}
                                                onOpenCreateTxtModal={() => setIsFileCreating(true)}
                                                onUploadFiles={handleUploadFiles}
                                                currentFolderId={currentFolder.id}
                                                refetch={refetch} />
                                </div>

                                <div className="h-5 w-px bg-gray-400 dark:bg-zinc-600"></div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                        <LayoutGrid size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                        <LayoutList size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">

                        {subfolders.length > 0 && (
                            <section className="mb-8">
                                <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
                                    Folders
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {subfolders.map((folder: FolderResponse) => (
                                        <FolderCard folder={folder}
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
                                        <FileCard file={file}
                                                  key={file.id} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>

            <CustomToaster />

            <FolderCreateModal isOpen={isSubfolderCreating}
                               onClose={() => {
                                   setIsSubfolderCreating(false);
                                   clearFolderCreateForm();
                               }}
                               folderName={newFolderName}
                               setFolderName={setNewFolderName}
                               folderIcon={newFolderIcon}
                               setFolderIcon={setNewFolderIcon}
                               onSubmit={() => handleCreateFolder()}
                               isLoading={isCreating}
                               clearForm={clearFolderCreateForm} />

            <FileCreateModal isOpen={isFileCreating}
                             onClose={() => {
                                 setIsFileCreating(false);
                                 clearFileCreateForm();
                             }}
                             fileName={newFileName}
                             setFileName={setNewFileName}
                             content={newFileContent}
                             setContent={setNewFileContent}
                             onSubmit={() => handleCreateFile(currentFolder?.id, refetch)}
                             clearForm={clearFileCreateForm} />
        </div>
    );
}

export default HomePage;
