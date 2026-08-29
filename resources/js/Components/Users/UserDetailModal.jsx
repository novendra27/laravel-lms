import React from 'react';
import { Mail, Calendar, CheckCircle2, XCircle, Edit3 } from 'lucide-react';
import Modal from '../UI/Modal';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

export default function UserDetailModal({
    open = false,
    onClose,
    user = null,
    onEdit = null,
}) {
    if (!user) return null;

    const role = user.roles?.[0];
    const roleName = role?.name || 'student';
    const roleDisplayName = role?.display_name || role?.name || 'Peserta';

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Informasi Detail Pengguna"
            description="Ringkasan data profil akun dan hak akses pengguna."
            maxWidth="xl"
        >
            <div className="space-y-5">
                {/* Header Banner */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
                    <img
                        src={
                            user.avatar_url ||
                            'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                        }
                        alt={user.name}
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/20 shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-white truncate">
                                {user.name}
                            </h4>
                            <Badge
                                variant={
                                    roleName === 'admin'
                                        ? 'admin'
                                        : roleName === 'instructor'
                                        ? 'instructor'
                                        : 'student'
                                }
                                size="sm"
                            >
                                {roleDisplayName}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-300 truncate mt-0.5">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                        <span className="text-slate-400 font-medium block mb-1">
                            Status Verifikasi Email
                        </span>
                        <div className="flex items-center gap-1.5 font-semibold">
                            {user.email_verified_at ? (
                                <span className="text-emerald-600 inline-flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Terverifikasi
                                </span>
                            ) : (
                                <span className="text-amber-600 inline-flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    Belum Verifikasi
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                        <span className="text-slate-400 font-medium block mb-1">
                            Tanggal Bergabung
                        </span>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Role Description Card */}
                {role?.description && (
                    <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 text-xs">
                        <span className="font-semibold text-indigo-900 block mb-0.5">
                            Otoritas Peran ({roleDisplayName}):
                        </span>
                        <p className="text-indigo-700/90 leading-relaxed">
                            {role.description}
                        </p>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>

                    {onEdit && (
                        <Button
                            type="button"
                            variant="primary"
                            icon={Edit3}
                            onClick={() => {
                                onClose();
                                onEdit(user);
                            }}
                        >
                            Edit Pengguna
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
