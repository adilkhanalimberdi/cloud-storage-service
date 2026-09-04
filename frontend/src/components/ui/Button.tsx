import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({children, variant = "primary", className = "", ...props}) => {
    const baseStyles = "px-4 py-2 rounded-xl font-medium text-sm transition-colors duration-200 disabled:opacity-50";

    const variants = {
        primary: "bg-indigo-500 hover:bg-indigo-600 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-500 hover:bg-red-600 text-white",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`}
                {...props}>
            {children}
        </button>
    );
};