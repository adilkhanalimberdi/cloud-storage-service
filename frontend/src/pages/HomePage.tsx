import {Toaster} from "react-hot-toast";
import {Header} from "../components/ui/Header.tsx";
import {SidebarItem} from "../components/ui/SidebarItem.tsx";
import {FolderCard} from "../components/ui/FolderCard.tsx";
import {FileCard} from "../components/ui/FileCard.tsx";
import type {SidebarItemResponse} from "../types/sidebar.item.ts";
import {type Icon, iconMap} from "../utils/icon.utils.ts";
import {useSidebar} from "../hooks/use.sidebar.ts";
import {Button} from "../components/ui/Button.tsx";

function HomePage() {
    const {sidebarItems, newSidebarLabel, setNewSidebarLabel, newSidebarIcon, setNewSidebarIcon, handleCreateSidebar, isCreating} = useSidebar();

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <Toaster position="bottom-right" />

            <Header />

            <div className="flex flex-1 overflow-hidden">

                <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
                    <div className="space-y-6">
                        <input type="text"
                               value={newSidebarLabel}
                               onChange={(e) => setNewSidebarLabel(e.target.value)} />

                        <select value={newSidebarIcon}
                                onChange={(e) => setNewSidebarIcon(e.target.value as Icon)}>
                            <option value="FOLDER">📁</option>
                            <option value="HARD_DRIVE">💻</option>
                            <option value="USERS">👥</option>
                            <option value="CLOCK">🕒</option>
                            <option value="STAR">⭐</option>
                            <option value="TRASH">🗑️</option>
                        </select>

                        <Button children="+ Загрузить"
                                variant="primary"
                                className="w-full py-3"
                                onClick={handleCreateSidebar}
                                disabled={isCreating} />

                        <nav className="space-y-1">
                            {sidebarItems != null && sidebarItems.map((item: SidebarItemResponse) => (
                                <SidebarItem icon={iconMap[item.icon]} label={item.label} />
                            ))}
                            {/*<SidebarItem icon="📁" label="Мой диск" active />*/}
                            {/*<SidebarItem icon="💻" label="Компьютеры" />*/}
                            {/*<SidebarItem icon="👥" label="Доступные мне" />*/}
                            {/*<SidebarItem icon="🕒" label="Недавние" />*/}
                            {/*<SidebarItem icon="⭐" label="Помеченные" />*/}
                            {/*<SidebarItem icon="🗑️" label="Корзина" />*/}
                        </nav>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
                            <span>Хранилище</span>
                            <span>7.5 GB из 15 GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full w-1/2" />
                        </div>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-zinc-900 m-0 md:m-2 md:rounded-2xl border border-transparent md:border-gray-200 md:dark:border-zinc-800 shadow-sm">

                    <div className="h-14 border-b border-gray-100 dark:border-zinc-800/80 px-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">Мой диск</span>
                            <span>/</span>
                            <span>Проекты</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                ⣿
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-300">
                                ☰
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">

                        <section className="mb-8">
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
                                Папки
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                <FolderCard name="Документы" itemsCount="12 файлов" />
                                <FolderCard name="Изображения" itemsCount="148 файлов" />
                                <FolderCard name="Проекты Java" itemsCount="5 файлов" />
                                <FolderCard name="Бэкапы БД" itemsCount="2 файла" />
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
                                Файлы
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <FileCard name="schema.sql" size="14 KB" type="code" />
                                <FileCard name="presentation.pdf" size="4.2 MB" type="pdf" />
                                <FileCard name="avatar.png" size="1.1 MB" type="image" />
                                <FileCard name="docker-compose.yml" size="2 KB" type="code" />
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomePage;
