import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Shield,
    CheckCircle2,
    XCircle,
    Eye,
    Edit3,
    Trash2,
    RotateCcw,
    Sparkles,
    ArchiveRestore,
    AlertTriangle,
    Clock,
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import Badge from '../../Components/UI/Badge';
import Pagination from '../../Components/Navigation/Pagination';
import ConfirmDialog from '../../Components/UI/ConfirmDialog';
import UserFormModal from '../../Components/Users/UserFormModal';
import UserDetailModal from '../../Components/Users/UserDetailModal';
import useDebounce from '../../Hooks/useDebounce';

export default function UsersIndex({
    users,
    filters = {},
    availableRoles = [],
    trashedCount = 0,
}) {
    const [statusTab, setStatusTab] = useState(filters.status || 'active');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const debouncedSearch = useDebounce(search, 350);

    // Modal States
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [forceDeleteDialogOpen, setForceDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Trigger router filter query when debounced search, selected role, or statusTab changes
    useEffect(() => {
        const query = {};
        if (statusTab && statusTab !== 'active') query.status = statusTab;
        if (debouncedSearch) query.search = debouncedSearch;
        if (selectedRole) query.role = selectedRole;

        const currentStatus = filters.status || 'active';
        const currentSearch = filters.search || '';
        const currentRole = filters.role || '';

        if (
            statusTab !== currentStatus ||
            debouncedSearch !== currentSearch ||
            selectedRole !== currentRole
        ) {
            router.get('/users', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    }, [debouncedSearch, selectedRole, statusTab]);

    const handleResetFilters = () => {
        setSearch('');
        setSelectedRole('');
        setStatusTab('active');
        router.get('/users', {}, { preserveScroll: true });
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setFormModalOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormModalOpen(true);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setDetailModalOpen(true);
    };

    // Soft-Delete (Move to trash)
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setConfirmDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedUser) return;

        setActionLoading(true);
        router.delete(`/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmDialogOpen(false);
                setSelectedUser(null);
            },
            onFinish: () => {
                setActionLoading(false);
            },
        });
    };

    // Restore
    const handleRestoreClick = (user) => {
        setSelectedUser(user);
        setRestoreDialogOpen(true);
    };

    const handleRestoreConfirm = () => {
        if (!selectedUser) return;

        setActionLoading(true);
        router.post(`/users/${selectedUser.id}/restore`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setRestoreDialogOpen(false);
                setSelectedUser(null);
            },
            onFinish: () => {
                setActionLoading(false);
            },
        });
    };

    // Force Delete (Permanent)
    const handleForceDeleteClick = (user) => {
        setSelectedUser(user);
        setForceDeleteDialogOpen(true);
    };

    const handleForceDeleteConfirm = () => {
        if (!selectedUser) return;

        setActionLoading(true);
        router.delete(`/users/${selectedUser.id}/force-delete`, {
            preserveScroll: true,
            onSuccess: () => {
                setForceDeleteDialogOpen(false);
                setSelectedUser(null);
            },
            onFinish: () => {
                setActionLoading(false);
            },
        });
    };

    const isTrashedView = statusTab === 'trashed';
    const hasActiveFilters = !!search || !!selectedRole;

    return (
        <AppLayout title="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            <div className="space-y-6">
                {/* Header Title & CTA Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-5 w-5 text-indigo-600" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Administrasi Akun
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                            {isTrashedView
                                ? 'Daftar Pengguna Nonaktif (Sampah)'
                                : 'Kelola Seluruh Pengguna'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isTrashedView
                                ? `Menampilkan ${users.total} akun yang telah dinonaktifkan (dapat dipulihkan kapan saja).`
                                : `Total ${users.total} pengguna aktif terdaftar di platform pembelajaran.`}
                        </p>
                    </div>

                    {!isTrashedView && (
                        <Button
                            type="button"
                            variant="primary"
                            icon={UserPlus}
                            onClick={handleCreateUser}
                            className="shadow-md shadow-indigo-500/20"
                        >
                            Tambah Pengguna Baru
                        </Button>
                    )}
                </div>

                {/* Status Tabs Navigation */}
                <div className="flex items-center gap-2 border-b border-slate-200">
                    <button
                        type="button"
                        onClick={() => setStatusTab('active')}
                        className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                            !isTrashedView
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        <span>Pengguna Aktif</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusTab('trashed')}
                        className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                            isTrashedView
                                ? 'border-rose-600 text-rose-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        <span>Sampah / Dinonaktifkan</span>
                        {trashedCount > 0 && (
                            <span
                                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                                    isTrashedView
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {trashedCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter & Search Bar Card */}
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
                                placeholder="Cari pengguna berdasarkan nama atau email..."
                                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs transition-all duration-150 bg-white placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Role Filter Selector */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-56 shrink-0">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Filter className="h-3.5 w-3.5" />
                                </div>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="block w-full rounded-xl border border-slate-200 pl-9 pr-8 py-2 text-xs text-slate-700 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">Semua Peran (Role)</option>
                                    {availableRoles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.display_name} ({role.name})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset Filter Button */}
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

                {/* Users Data Table */}
                <Card bodyClassName="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <th scope="col" className="py-3.5 pl-6 pr-3">
                                        Pengguna
                                    </th>
                                    <th scope="col" className="px-4 py-3.5">
                                        Peran (Role)
                                    </th>
                                    <th scope="col" className="px-4 py-3.5">
                                        {isTrashedView ? 'Waktu Dinonaktifkan' : 'Status Email'}
                                    </th>
                                    <th scope="col" className="px-4 py-3.5">
                                        Tanggal Terdaftar
                                    </th>
                                    <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((user) => {
                                        const role = user.roles?.[0];
                                        const roleName = role?.name || 'student';
                                        const roleDisplayName =
                                            role?.display_name || role?.name || 'Peserta';
                                        const isTrashed = !!user.deleted_at;

                                        return (
                                            <tr
                                                key={user.id}
                                                className={`transition-colors group ${
                                                    isTrashed
                                                        ? 'bg-rose-50/20 hover:bg-rose-50/40'
                                                        : 'hover:bg-slate-50/70'
                                                }`}
                                            >
                                                {/* User Info & Avatar */}
                                                <td className="py-3.5 pl-6 pr-3 min-w-[220px]">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                user.avatar_url ||
                                                                'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                                                            }
                                                            alt={user.name}
                                                            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                                                        />
                                                        <div className="min-w-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleViewUser(user)}
                                                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block text-left"
                                                            >
                                                                {user.name}
                                                            </button>
                                                            <span className="text-[11px] text-slate-400 truncate block">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Role Badge */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
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
                                                </td>

                                                {/* Email Verified Status OR Deletion Date */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    {isTrashed ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {new Date(user.deleted_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    ) : user.email_verified_at ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Terverifikasi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Belum Verifikasi
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Created At */}
                                                <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                                                    {new Date(user.created_at).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                                                    {isTrashed ? (
                                                        /* Trashed User Action Buttons (Restore & Force Delete) */
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                icon={ArchiveRestore}
                                                                onClick={() => handleRestoreClick(user)}
                                                            >
                                                                Pulihkan
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="danger"
                                                                size="sm"
                                                                icon={Trash2}
                                                                onClick={() => handleForceDeleteClick(user)}
                                                            >
                                                                Hapus Permanen
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        /* Active User Action Buttons (View, Edit, Soft-Delete) */
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleViewUser(user)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                                title="Lihat Detail"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditUser(user)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                                title="Edit Pengguna"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                                title="Nonaktifkan Pengguna"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                            <p className="font-semibold text-slate-700">
                                                {isTrashedView
                                                    ? 'Tidak ada akun pengguna yang berada di sampah.'
                                                    : 'Tidak ada data pengguna yang ditemukan.'}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {hasActiveFilters
                                                    ? 'Coba ubah kata kunci pencarian atau reset filter role Anda.'
                                                    : isTrashedView
                                                    ? 'Akun yang dinonaktifkan akan muncul di sini.'
                                                    : 'Mulai dengan menambahkan pengguna pertama Anda.'}
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

                    {/* Pagination Bar */}
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-700">
                                {users.from || 0}
                            </span>{' '}
                            sampai{' '}
                            <span className="font-semibold text-slate-700">
                                {users.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-slate-700">
                                {users.total}
                            </span>{' '}
                            pengguna
                        </span>

                        <Pagination links={users.links} />
                    </div>
                </Card>
            </div>

            {/* Form Modal (Create / Edit) */}
            <UserFormModal
                open={formModalOpen}
                onClose={() => {
                    setFormModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                availableRoles={availableRoles}
            />

            {/* Detail Modal */}
            <UserDetailModal
                open={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onEdit={(u) => {
                    setDetailModalOpen(false);
                    handleEditUser(u);
                }}
            />

            {/* Soft-Delete Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => {
                    setConfirmDialogOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleDeleteConfirm}
                loading={actionLoading}
                title="Nonaktifkan Akun Pengguna"
                description={`Apakah Anda yakin ingin menonaktifkan akun "${selectedUser?.name}" (${selectedUser?.email})? Akun ini akan dipindahkan ke tab Sampah dan dapat dipulihkan kapan saja.`}
                confirmText="Ya, Nonaktifkan"
                cancelText="Batal"
                variant="warning"
            />

            {/* Restore Confirmation Dialog */}
            <ConfirmDialog
                open={restoreDialogOpen}
                onClose={() => {
                    setRestoreDialogOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleRestoreConfirm}
                loading={actionLoading}
                title="Pulihkan Akun Pengguna"
                description={`Apakah Anda yakin ingin memulihkan kembali akun "${selectedUser?.name}" (${selectedUser?.email}) ke daftar pengguna aktif?`}
                confirmText="Ya, Pulihkan Akun"
                cancelText="Batal"
                variant="info"
            />

            {/* Force-Delete Confirmation Dialog */}
            <ConfirmDialog
                open={forceDeleteDialogOpen}
                onClose={() => {
                    setForceDeleteDialogOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleForceDeleteConfirm}
                loading={actionLoading}
                title="Hapus Akun Pengguna Secara Permanen"
                description={`PERINGATAN: Apakah Anda benar-benar yakin ingin menghapus akun "${selectedUser?.name}" (${selectedUser?.email}) secara PERMANEN? Seluruh data yang terkait dan file avatar akan dimusnahkan dan tidak dapat dipulihkan kembali.`}
                confirmText="Hapus Permanen"
                cancelText="Batal"
                variant="danger"
            />
        </AppLayout>
    );
}
