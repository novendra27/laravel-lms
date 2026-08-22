import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon = null,
    className = '',
    onClick,
    ...props
}) {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:bg-indigo-800 shadow-sm shadow-indigo-200',
        secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:ring-indigo-500 shadow-sm',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 active:bg-rose-800 shadow-sm shadow-rose-200',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 active:bg-emerald-800 shadow-sm shadow-emerald-200',
        outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
        md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
        lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-current" />
            ) : Icon ? (
                <Icon className="h-4 w-4 shrink-0 text-current" />
            ) : null}
            <span>{children}</span>
        </button>
    );
}
