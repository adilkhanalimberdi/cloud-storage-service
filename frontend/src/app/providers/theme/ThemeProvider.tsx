import {useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {type ResolvedTheme, type Theme, ThemeProviderContext} from "./theme.context.ts";

type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyThemeClass = (resolved: ResolvedTheme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
};

function ThemeProvider({
                           children,
                           defaultTheme = "system",
                           storageKey = "ui-theme",
                       }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") return defaultTheme;
        const stored = window.localStorage.getItem(storageKey) as Theme | null;
        return stored ?? defaultTheme;
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
        theme === "system" ? getSystemTheme() : theme
    );

    useEffect(() => {
        const resolved = theme === "system" ? getSystemTheme() : theme;
        setResolvedTheme(resolved);
        applyThemeClass(resolved);

        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => {
            const nextResolved: ResolvedTheme = event.matches ? "dark" : "light";
            setResolvedTheme(nextResolved);
            applyThemeClass(nextResolved);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const setTheme = (nextTheme: Theme) => {
        window.localStorage.setItem(storageKey, nextTheme);
        setThemeState(nextTheme);
    };

    const value = useMemo(
        () => ({theme, resolvedTheme, setTheme}),
        [theme, resolvedTheme]
    );

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export default ThemeProvider;
