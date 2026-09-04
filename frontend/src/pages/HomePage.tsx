import toast, {Toaster} from "react-hot-toast";
import ThemeSwitcher from "../components/themeSwitcher/ThemeSwitcher.tsx";
import {handleError} from "../utls/error.handler.ts";
import {useState} from "react";
import {Button} from "../components/ui/Button.tsx";
import {useAuth} from "../hooks/use.auth.ts";

function HomePage() {
    const {logout} = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            toast.success("Successfully logged out!");
        } catch (err) {
            handleError(err as Error, "Failed to logout, please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div>
            <Toaster position="bottom-right" />
            <div className="flex items-center justify-between p-4">
                <span className="">Cloud Storage</span>
                <ThemeSwitcher />
                <Button children={"Logout"}
                        variant="primary"
                        onClick={handleLogout}
                        disabled={isLoggingOut}/>
            </div>
        </div>
    );
}

export default HomePage;
