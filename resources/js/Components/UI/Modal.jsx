import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
    open = false,
    onClose,
    title = '',
    description = '',
    children,
    maxWidth = 'md',
    showCloseButton = true,
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && open) {
                onClose?.();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    const maxWidths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog Panel */}
            <div
                className={`relative w-full ${
                    maxWidths[maxWidth] || maxWidths.md
                } transform rounded-3xl bg-white p-6 sm:p-7 text-left shadow-2xl transition-all z-10 border border-slate-100 animate-scaleUp`}
                role="dialog"
                aria-modal="true"
            >
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between gap-4 pb-3.5 border-b border-slate-100 mb-5">
                        <div>
                            {title && (
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Tutup</span>
                            </button>
                        )}
                    </div>
                )}

                <div>{children}</div>
            </div>
        </div>
    );
}
