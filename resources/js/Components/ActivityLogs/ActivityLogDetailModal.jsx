import React, { useState } from 'react';
import { Activity, Copy, Check, Calendar, User, Code2 } from 'lucide-react';
import Modal from '../UI/Modal';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

export default function ActivityLogDetailModal({
    open = false,
    onClose,
    log = null,
}) {
    const [copied, setCopied] = useState(false);

    if (!log) return null;

    const handleCopy = () => {
        if (log.properties) {
            navigator.clipboard.writeText(JSON.stringify(log.properties, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getEventVariant = (event) => {
        if (event?.includes('created')) return 'green';
        if (event?.includes('updated')) return 'yellow';
        if (event?.includes('deleted')) return 'red';
        return 'indigo';
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Detail Log Aktivitas Sistem"
            description="Informasi jejak audit mutasi data yang tercatat."
            maxWidth="lg"
        >
            <div className="space-y-4">
                {/* Header Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                log.user?.avatar_url ||
                                'https://ui-avatars.com/api/?name=System&background=6366f1&color=fff'
                            }
                            alt={log.user?.name || 'Sistem'}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                        />
                        <div>
                            <span className="text-xs text-slate-400 font-medium block">
                                Aktor Eksekutor:
                            </span>
                            <h4 className="text-sm font-bold text-white">
                                {log.user?.name || 'Sistem / CLI'}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                                {log.user?.email || 'Aksi otomatis sistem'}
                            </p>
                        </div>
                    </div>

                    <Badge variant={getEventVariant(log.event)} size="sm">
                        {log.event}
                    </Badge>
                </div>

                {/* Description & Target Meta */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-2">
                    <div>
                        <span className="text-slate-400 font-medium block">Deskripsi Aktivitas:</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{log.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                        <div>
                            <span className="text-slate-400 font-medium">Waktu Tercatat:</span>
                            <p className="font-semibold text-slate-700">
                                {new Date(log.created_at).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </p>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium">Subjek Target:</span>
                            <p className="font-semibold text-slate-700">
                                {log.subject_type ? `${log.subject_type.split('\\').pop()} (#${log.subject_id})` : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* JSON Properties Viewer */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                            <Code2 className="h-4 w-4 text-indigo-600" />
                            Snapshot Properti Data (JSON Diff)
                        </span>

                        {log.properties && (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3 text-emerald-600" />
                                        <span className="text-emerald-600">Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        <span>Salin JSON</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="rounded-xl bg-slate-950 p-3.5 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56 scrollbar-thin scrollbar-thumb-slate-800 border border-slate-800">
                        {log.properties && Object.keys(log.properties).length > 0 ? (
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(log.properties, null, 2)}
                            </pre>
                        ) : (
                            <span className="text-slate-500 italic">
                                Tidak ada payload properti tambahan yang tercatat.
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Button */}
                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
