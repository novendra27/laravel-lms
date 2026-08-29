import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    Search,
    Filter,
    Calendar,
    Eye,
    RotateCcw,
    Code2,
    Shield,
    Clock,
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Badge from '../../Components/UI/Badge';
import Pagination from '../../Components/Navigation/Pagination';
import ActivityLogDetailModal from '../../Components/ActivityLogs/ActivityLogDetailModal';
import useDebounce from '../../Hooks/useDebounce';

export default function ActivityLogsIndex({ logs, filters = {}, availableEvents = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedEvent, setSelectedEvent] = useState(filters.event || '');
    const debouncedSearch = useDebounce(search, 350);

    // Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        const query = {};
        if (debouncedSearch) query.search = debouncedSearch;
        if (selectedEvent) query.event = selectedEvent;

        if (debouncedSearch !== (filters.search || '') || selectedEvent !== (filters.event || '')) {
            router.get('/activity-logs', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    }, [debouncedSearch, selectedEvent]);

    const handleResetFilters = () => {
        setSearch('');
        setSelectedEvent('');
        router.get('/activity-logs', {}, { preserveScroll: true });
    };

    const handleViewDetail = (log) => {
        setSelectedLog(log);
        setDetailModalOpen(true);
    };

    const getEventBadgeVariant = (event) => {
        if (event?.includes('created')) return 'green';
        if (event?.includes('updated')) return 'yellow';
        if (event?.includes('deleted')) return 'red';
        return 'indigo';
    };

    const hasActiveFilters = !!search || !!selectedEvent;

    return (
        <AppLayout title="Audit Log Sistem">
            <Head title="Audit Log Sistem" />

            <div className="space-y-6">
                {/* Header Title */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-5 w-5 text-indigo-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Keamanan & Rekam Jejak
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                        Audit Log Aktivitas Sistem
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Memantau seluruh perubahan, mutasi data, dan riwayat aktivitas yang terjadi di platform.
                    </p>
                </div>

                {/* Filter & Search Bar */}
                <Card bodyClassName="p-4 sm:p-5">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Search className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan deskripsi atau nama aktor..."
                                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs transition-all duration-150 bg-white placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Event Selector */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-56 shrink-0">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Filter className="h-3.5 w-3.5" />
                                </div>
                                <select
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    className="block w-full rounded-xl border border-slate-200 pl-9 pr-8 py-2 text-xs text-slate-700 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">Semua Tipe Event</option>
                                    {availableEvents.map((evt, idx) => (
                                        <option key={idx} value={evt}>
                                            {evt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="rounded-xl p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                    title="Reset Filter"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Audit Logs Data Table */}
                <Card bodyClassName="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <th scope="col" className="py-3.5 pl-6 pr-3">
                                        Waktu & Tanggal
                                    </th>
                                    <th scope="col" className="px-4 py-3.5">
                                        Aktor Pengguna
                                    </th>
                                    <th scope="col" className="px-4 py-3.5">
                                        Tipe Event
                                    </th>
                                    <th scope="col" className="px-4 py-3.5">
                                        Deskripsi Aktivitas
                                    </th>
                                    <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                                        Snapshot
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {logs.data && logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-slate-50/70 transition-colors group"
                                        >
                                            {/* Timestamp */}
                                            <td className="py-3.5 pl-6 pr-3 whitespace-nowrap text-slate-500 text-[11px]">
                                                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>
                                                        {new Date(log.created_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                                    {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </td>

                                            {/* Actor User */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    <img
                                                        src={
                                                            log.user?.avatar_url ||
                                                            'https://ui-avatars.com/api/?name=System&background=6366f1&color=fff'
                                                        }
                                                        alt={log.user?.name || 'System'}
                                                        className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <span className="font-bold text-slate-900 truncate block">
                                                            {log.user?.name || 'Sistem Otomatis'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 truncate block">
                                                            {log.user?.email || 'System Action'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Event Type */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <Badge
                                                    variant={getEventBadgeVariant(log.event)}
                                                    size="sm"
                                                >
                                                    {log.event}
                                                </Badge>
                                            </td>

                                            {/* Description */}
                                            <td className="px-4 py-3.5 text-slate-700 font-medium leading-relaxed max-w-md">
                                                {log.description}
                                            </td>

                                            {/* Action / Snapshot */}
                                            <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    icon={Code2}
                                                    onClick={() => handleViewDetail(log)}
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            <Activity className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                            <p className="font-semibold text-slate-700">
                                                Tidak ada log aktivitas yang tercatat.
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {hasActiveFilters
                                                    ? 'Coba ubah kata kunci pencarian atau reset filter Anda.'
                                                    : 'Aktivitas mutasi data sistem akan otomatis tercatat di sini.'}
                                            </p>
                                            {hasActiveFilters && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    icon={RotateCcw}
                                                    onClick={handleResetFilters}
                                                    className="mt-3"
                                                >
                                                    Reset Filter
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-700">
                                {logs.from || 0}
                            </span>{' '}
                            sampai{' '}
                            <span className="font-semibold text-slate-700">
                                {logs.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-slate-700">
                                {logs.total}
                            </span>{' '}
                            log aktivitas
                        </span>

                        <Pagination links={logs.links} />
                    </div>
                </Card>
            </div>

            {/* Log Detail Modal */}
            <ActivityLogDetailModal
                open={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    setSelectedLog(null);
                }}
                log={selectedLog}
            />
        </AppLayout>
    );
}
