import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function FlashMessage({ flash: directFlash = null }) {
    const { flash: pageFlash } = usePage().props;
    const flash = directFlash || pageFlash || {};

    const [visible, setVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [currentType, setCurrentType] = useState('info');

    useEffect(() => {
        if (flash?.success) {
            setCurrentMessage(flash.success);
            setCurrentType('success');
            setVisible(true);
        } else if (flash?.error) {
            setCurrentMessage(flash.error);
            setCurrentType('error');
            setVisible(true);
        } else if (flash?.warning) {
            setCurrentMessage(flash.warning);
            setCurrentType('warning');
            setVisible(true);
        } else if (flash?.info) {
            setCurrentMessage(flash.info);
            setCurrentType('info');
            setVisible(true);
        } else {
            setVisible(false);
        }

        // Auto dismiss after 5 seconds
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [flash]);

    if (!visible || !currentMessage) return null;

    const styles = {
        success: {
            bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
            icon: CheckCircle2,
            iconColor: 'text-emerald-500',
        },
        error: {
            bg: 'bg-rose-50 border-rose-200 text-rose-900',
            icon: AlertCircle,
            iconColor: 'text-rose-500',
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200 text-amber-900',
            icon: AlertTriangle,
            iconColor: 'text-amber-500',
        },
        info: {
            bg: 'bg-sky-50 border-sky-200 text-sky-900',
            icon: Info,
            iconColor: 'text-sky-500',
        },
    };

    const currentStyle = styles[currentType] || styles.info;
    const Icon = currentStyle.icon;

    return (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-slideIn">
            <div
                className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${currentStyle.bg}`}
                role="alert"
            >
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${currentStyle.iconColor}`} />
                <div className="flex-1 text-sm font-medium leading-snug">
                    {currentMessage}
                </div>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="p-1 -mr-1 -mt-1 text-current opacity-60 hover:opacity-100 rounded-lg hover:bg-black/5 transition-opacity"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
