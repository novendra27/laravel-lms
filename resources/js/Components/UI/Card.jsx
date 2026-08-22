import React from 'react';

export default function Card({
    children,
    title = '',
    subtitle = '',
    headerRight = null,
    footer = null,
    className = '',
    bodyClassName = '',
    headerClassName = '',
    ...props
}) {
    const hasHeader = title || subtitle || headerRight;

    return (
        <div
            className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 ${className}`}
            {...props}
        >
            {hasHeader && (
                <div
                    className={`px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 ${headerClassName}`}
                >
                    <div>
                        {title && (
                            <h3 className="text-base font-semibold text-slate-900 leading-snug">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                        )}
                    </div>

                    {headerRight && (
                        <div className="flex items-center gap-2">{headerRight}</div>
                    )}
                </div>
            )}

            <div className={`p-6 ${bodyClassName}`}>{children}</div>

            {footer && (
                <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {footer}
                </div>
            )}
        </div>
    );
}
