"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "md" | "lg";
};

const base =
    "inline-flex items-center justify-center rounded-xl font-semibold " +
    "transition-[background,box-shadow,transform] active:translate-y-[1px] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

const sizes = {
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 shadow",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export default function Button({
                                   variant = "primary",
                                   size = "lg",
                                   className = "",
                                   ...props
                               }: ButtonProps) {
    const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
    return <button className={cls} {...props} />;
}
