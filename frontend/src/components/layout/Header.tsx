
import { toast } from 'react-hot-toast';
import ThemeSwitcher from "../ui/ThemeSwitcher.tsx";
import {Button} from "../ui/Button.tsx";
import {handleError} from "../../utils/error.handler.ts";
import {useAuth} from "../../hooks/use.auth.ts";
import {useState} from "react";

export function Header() {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            toast.success("Успешный выход!");
        } catch (err) {
            handleError(err as Error, "Не удалось выйти, попробуйте снова.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between shrink-0">
            <div className="w-64 flex items-center gap-3">
                <span className="font-semibold text-lg text-gray-800 dark:text-zinc-100 tracking-wide">Cloud Storage</span>
            </div>

            <div className="flex items-center justify-center">
                <ThemeSwitcher />
            </div>

            <div className="w-64 flex items-center justify-end gap-3">
                <Button variant="primary"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="px-4 py-2 w-24 text-sm font-medium transition-all">
                    {isLoggingOut ? "Logout..." : "Logout"}
                </Button>
            </div>
        </header>
    );
}