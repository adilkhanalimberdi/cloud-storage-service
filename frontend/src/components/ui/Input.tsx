import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-zinc-400">{label}</label>
            )}
            <input
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 text-sm placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 dark:border-zinc-800 focus:border-indigo-500"
                } ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
        </div>
    );
};