import {useTheme} from "../../hooks/use.theme.ts";
import type {Theme} from "../../app/providers/theme/theme.context.ts";
import {MonitorIcon, MoonIcon, SunIcon} from "./icons.tsx";

const OPTIONS: {value: Theme; label: string; icon: typeof SunIcon}[] = [
    {value: "light", label: "Светлая", icon: SunIcon},
    {value: "dark", label: "Тёмная", icon: MoonIcon},
    {value: "system", label: "Системная", icon: MonitorIcon},
];

function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();

    return (
        <div
            role="radiogroup"
            aria-label="Переключение темы"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900"
        >
            {OPTIONS.map(({value, label, icon: Icon}) => {
                const isActive = theme === value;

                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        title={label}
                        onClick={() => setTheme(value)}
                        className={[
                            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500",
                            isActive
                                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50"
                                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
                        ].join(" ")}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="sr-only">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default ThemeSwitcher;
