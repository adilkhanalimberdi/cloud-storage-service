import {Toaster} from "react-hot-toast";
import ThemeSwitcher from "../components/themeSwitcher/ThemeSwitcher.tsx";

function HomePage() {
    return (
        <div>
            <Toaster position="bottom-right" />
            <div className="flex items-center justify-between p-4">
                <span className="">Cloud Storage</span>
                <ThemeSwitcher />
            </div>
        </div>
    );
}

export default HomePage;