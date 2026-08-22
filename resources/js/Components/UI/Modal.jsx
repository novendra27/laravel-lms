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
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '4xl': 'sm:max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog Panel */}
            <div
                className={`relative w-full ${
                    maxWidths[maxWidth] || maxWidths.md
                } transform rounded-2xl bg-white p-6 text-left shadow-2xl transition-all z-10 border border-slate-100 animate-scaleUp`}
                role="dialog"
                aria-modal="true"
            >
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 mb-4">
                        <div>
                            {title && (
                                <h3 className="text-lg font-bold text-slate-900 leading-6">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="mt-1 text-xs text-slate-500">{description}</p>
                            )}
                        </div>

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
