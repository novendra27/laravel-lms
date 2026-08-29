import React from 'react';
import { AlertTriangle, Trash2, Info, HelpCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
    open = false,
    onClose,
    onConfirm,
    title = 'Konfirmasi Tindakan',
    description = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Ya, Hapus',
    cancelText = 'Batal',
    variant = 'danger',
    loading = false,
    icon: CustomIcon = null,
}) {
    const variantStyles = {
        danger: {
            bg: 'bg-rose-50 border-rose-200 text-rose-800',
            icon: Trash2,
            iconColor: 'text-rose-600',
            btnVariant: 'danger',
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200 text-amber-800',
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            btnVariant: 'primary',
        },
        info: {
            bg: 'bg-sky-50 border-sky-200 text-sky-800',
            icon: Info,
            iconColor: 'text-sky-600',
            btnVariant: 'primary',
        },
    };

    const currentVariant = variantStyles[variant] || variantStyles.danger;
    const Icon = CustomIcon || currentVariant.icon;

    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
            title={title}
            maxWidth="md"
        >
            <div className="space-y-4">
                <div
                    className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${currentVariant.bg}`}
                >
                    <Icon
                        className={`h-5 w-5 shrink-0 mt-0.5 ${currentVariant.iconColor}`}
                    />
                    <div>{description}</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={loading}
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        variant={currentVariant.btnVariant}
                        loading={loading}
                        icon={Icon}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
