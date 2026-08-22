import React, { useState, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    User,
    Mail,
    Lock,
    Camera,
    ShieldAlert,
    Save,
    Trash2,
    KeyRound,
    AlertTriangle,
    Eye,
    EyeOff,
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import TextInput from '../../Components/UI/TextInput';
import Button from '../../Components/UI/Button';
import Modal from '../../Components/UI/Modal';
import Badge from '../../Components/UI/Badge';

export default function ProfileEdit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AppLayout title="Pengaturan Profil">
            <Head title="Pengaturan Profil" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-800">
                    <img
                        src={
                            user?.avatar_url ||
                            'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                        }
                        alt={user?.name}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
                    />
                    <div className="text-center sm:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                {user?.name}
                            </h2>
                            <Badge
                                variant={
                                    user?.is_admin
                                        ? 'admin'
                                        : user?.is_instructor
                                        ? 'instructor'
                                        : 'student'
                                }
                                size="sm"
                            >
                                {user?.is_admin
                                    ? 'Administrator'
                                    : user?.is_instructor
                                    ? 'Instruktur'
                                    : 'Peserta'}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{user?.email}</p>
                        <p className="text-[11px] text-slate-400 mt-3 font-medium">
                            Kelola data diri, kredensial keamanan, dan preferensi akun Anda.
                        </p>
                    </div>
                </div>

                {/* Section 1: Update Profile Info & Avatar */}
                <UpdateProfileInformationForm user={user} />

                {/* Section 2: Update Password */}
                <UpdatePasswordForm />

                {/* Section 3: Delete Account (Danger Zone) */}
                <DeleteUserForm />
            </div>
        </AppLayout>
    );
}

function UpdateProfileInformationForm({ user }) {
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'patch',
        name: user?.name || '',
        email: user?.email || '',
        avatar: null,
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Card
            title="Informasi Profil & Avatar"
            subtitle="Perbarui nama lengkap, alamat email, dan foto profil Anda."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Picker with Live Preview */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                        Foto Profil
                    </label>
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <img
                                src={
                                    avatarPreview ||
                                    'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                                }
                                alt={user?.name}
                                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-200 shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                icon={Camera}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Unggah Foto Baru
                            </Button>
                            <p className="text-[11px] text-slate-400 mt-1.5">
                                Format: JPG, PNG, WEBP (Maks. 2MB).
                            </p>
                        </div>
                    </div>
                    {errors.avatar && (
                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                            {errors.avatar}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                        label="Nama Lengkap"
                        name="name"
                        value={data.name}
                        icon={User}
                        error={errors.name}
                        required
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <TextInput
                        label="Alamat Email"
                        type="email"
                        name="email"
                        value={data.email}
                        icon={Mail}
                        error={errors.email}
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    {recentlySuccessful && (
                        <span className="text-xs font-semibold text-emerald-600 animate-fadeIn">
                            Tersimpan!
                        </span>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Save}
                        loading={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

function UpdatePasswordForm() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card
            title="Keamanan & Kata Sandi"
            subtitle="Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk menjaga keamanan."
        >
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <TextInput
                    label="Kata Sandi Saat Ini"
                    type={showPassword ? 'text' : 'password'}
                    name="current_password"
                    value={data.current_password}
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.current_password}
                    autoComplete="current-password"
                    required
                    onChange={(e) => setData('current_password', e.target.value)}
                />

                <TextInput
                    label="Kata Sandi Baru"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={data.password}
                    placeholder="Minimal 8 karakter"
                    icon={KeyRound}
                    error={errors.password}
                    autoComplete="new-password"
                    required
                    onChange={(e) => setData('password', e.target.value)}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    }
                />

                <TextInput
                    label="Konfirmasi Kata Sandi Baru"
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={data.password_confirmation}
                    placeholder="Ulangi kata sandi baru"
                    icon={KeyRound}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    required
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                    {recentlySuccessful && (
                        <span className="text-xs font-semibold text-emerald-600 animate-fadeIn">
                            Kata sandi berhasil diperbarui!
                        </span>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Save}
                        loading={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy('/profile', {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => {},
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <Card
            title="Zona Bahaya: Hapus Akun"
            subtitle="Setelah akun Anda dihapus, semua data profil dan histori belajar akan dihapus secara permanen."
            headerClassName="bg-rose-50/50"
            className="border-rose-200/80"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-600 max-w-lg">
                    Sebelum menghapus akun Anda, pastikan Anda telah mengunduh semua data atau materi yang ingin Anda simpan.
                </div>

                <Button
                    type="button"
                    variant="danger"
                    icon={Trash2}
                    onClick={confirmUserDeletion}
                >
                    Hapus Akun Saya
                </Button>
            </div>

            {/* Confirmation Modal */}
            <Modal
                open={confirmingUserDeletion}
                onClose={closeModal}
                title="Konfirmasi Penghapusan Akun"
                description="Apakah Anda benar-benar yakin ingin menghapus akun Anda secara permanen?"
                maxWidth="md"
            >
                <form onSubmit={deleteUser} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>
                            Tindakan ini tidak dapat dibatalkan. Masukkan kata sandi akun Anda untuk mengonfirmasi.
                        </span>
                    </div>

                    <TextInput
                        label="Kata Sandi Akun"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        icon={Lock}
                        error={errors.password}
                        required
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <div className="flex justify-end gap-3 pt-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeModal}
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            variant="danger"
                            loading={processing}
                            icon={Trash2}
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun Saya'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}
