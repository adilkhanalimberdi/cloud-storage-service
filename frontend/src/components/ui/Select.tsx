export interface SelectOption<T extends string> {
    value: T;
    label: string;
    icon?: string;
}

interface SelectProps<T extends string> {
    label?: string;
    options: SelectOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export const Select = <T extends string>({label, options, value, onChange, className = "",}: SelectProps<T>) => {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    {label}
                </label>
            )}
            <div className="relative">
                <select value={value}
                        onChange={(e) => onChange(e.target.value as T)}
                        className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer">
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.icon ? `${opt.icon} ${opt.label}` : opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    ▼
                </div>
            </div>
        </div>
    );
};