import { Toaster } from "react-hot-toast";

export function CustomToaster() {
    return (
        <Toaster
            position="bottom-right"
            containerStyle={{ zIndex: 100 }}
            containerClassName="dark:dark"
            toastOptions={{
                className: "!bg-white dark:!bg-zinc-800 !text-gray-900 dark:!text-zinc-100 !border !border-gray-200 dark:!border-zinc-800 shadow-lg rounded-xl text-sm font-medium",
                success: {
                    iconTheme: {
                        primary: "#22c65e",
                        secondary: "#ffffff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                },
            }}
        />
    );
}