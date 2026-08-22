import React from 'react';

export default function Badge({
    children,
    variant = 'gray',
    size = 'md',
    icon: Icon = null,
    className = '',
}) {
    const variants = {
        admin: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        instructor: 'bg-purple-50 text-purple-700 border-purple-200/80',
        student: 'bg-sky-50 text-sky-700 border-sky-200/80',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
        blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        yellow: 'bg-amber-50 text-amber-700 border-amber-200/80',
        warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
        red: 'bg-rose-50 text-rose-700 border-rose-200/80',
        danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
        gray: 'bg-slate-100 text-slate-700 border-slate-200/80',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[11px] font-medium gap-1',
        md: 'px-2.5 py-0.5 text-xs font-medium gap-1.5',
        lg: 'px-3 py-1 text-sm font-semibold gap-2',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border shadow-2xs font-medium transition-colors ${
                variants[variant] || variants.gray
            } ${sizes[size] || sizes.md} ${className}`}
        >
            {Icon && <Icon className="h-3 w-3 shrink-0" />}
            <span>{children}</span>
        </span>
    );
}
