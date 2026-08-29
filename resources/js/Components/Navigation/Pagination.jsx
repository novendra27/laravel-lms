import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links = [], className = '' }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav
            role="navigation"
            aria-label="Pagination Navigation"
            className={`flex items-center justify-center gap-1.5 ${className}`}
        >
            {links.map((link, index) => {
                const isPrevious = index === 0;
                const isNext = index === links.length - 1;

                let label = link.label;
                if (isPrevious) {
                    label = (
                        <span className="flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Sebelumnya</span>
                        </span>
                    );
                } else if (isNext) {
                    label = (
                        <span className="flex items-center gap-1">
                            <span className="hidden sm:inline">Berikutnya</span>
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    );
                }

                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className="inline-flex min-w-9 h-9 items-center justify-center rounded-xl px-3 py-1 text-xs font-medium text-slate-300 bg-slate-50 border border-slate-200/60 cursor-not-allowed select-none"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`inline-flex min-w-9 h-9 items-center justify-center rounded-xl px-3 py-1 text-xs font-semibold transition-all duration-150 select-none ${
                            link.active
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-bold border border-indigo-600'
                                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
