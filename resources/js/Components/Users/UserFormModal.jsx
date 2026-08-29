import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { User, Mail, Lock, Shield, Camera, Save, UserPlus, Eye, EyeOff } from 'lucide-react';
import Modal from '../UI/Modal';
import TextInput from '../UI/TextInput';
import SelectInput from '../UI/SelectInput';
import Button from '../UI/Button';

export default function UserFormModal({
    open = false,
    onClose,
    user = null,
    availableRoles = [],
}) {
    const isEdit = !!user;
    const fileInputRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
        password_confirmation: '',
        avatar: null,
        _method: isEdit ? 'put' : 'post',
    });

    // Populate data when modal opens or user prop changes
    useEffect(() => {
        if (open) {
            clearErrors();
            if (user) {
                setData({
                    name: user.name || '',
                    email: user.email || '',
                    role: user.roles?.[0]?.name || 'student',
                    password: '',
                    password_confirmation: '',
                    avatar: null,
                    _method: 'put',
                });
                setAvatarPreview(user.avatar_url || null);
            } else {
                setData({
                    name: '',
                    email: '',
                    role: 'student',
                    password: '',
                    password_confirmation: '',
                    avatar: null,
                    _method: 'post',
                });
                setAvatarPreview(null);
            }
        }
    }, [open, user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(`/users/${user.id}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/users', {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            open={open}
            onClose={processing ? undefined : onClose}
            title={isEdit ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
            description={
                isEdit
                    ? `Perbarui informasi akun dan hak akses peran untuk ${user?.name}.`
                    : 'Daftarkan akun pengguna baru ke dalam sistem pembelajaran.'
            }
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar Picker with Live Preview */}
                <div className="flex items-center gap-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 mb-2">
                    <div className="relative group shrink-0">
                        <img
                            src={
                                avatarPreview ||
                                (user?.avatar_url
                                    ? user.avatar_url
                                    : 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff')
                            }
                            alt="Avatar Preview"
                            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-200 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="min-w-0 flex-1">
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
                            Pilih Foto Avatar
                        </Button>
                        <p className="text-[11px] text-slate-400 mt-1">
                            JPG, PNG, WEBP (Maksimal 2MB).
                        </p>
                        {errors.avatar && (
                            <p className="text-xs text-rose-600 mt-1 font-medium">
                                {errors.avatar}
                            </p>
                        )}
                    </div>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <TextInput
                        label="Nama Lengkap"
                        name="name"
                        value={data.name}
                        placeholder="Contoh: Budi Santoso"
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
                        placeholder="nama@domain.com"
                        icon={Mail}
                        error={errors.email}
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </div>

                {/* Role Selector */}
                <SelectInput
                    label="Peran Akun (Role)"
                    name="role"
                    value={data.role}
                    icon={Shield}
                    error={errors.role}
                    required
                    options={availableRoles.map((r) => ({
                        value: r.name,
                        label: `${r.display_name} — ${r.description}`,
                    }))}
                    onChange={(e) => setData('role', e.target.value)}
                />

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <TextInput
                        label={isEdit ? 'Kata Sandi Baru (Opsional)' : 'Kata Sandi'}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        placeholder={isEdit ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
                        icon={Lock}
                        error={errors.password}
                        required={!isEdit}
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
                        label="Konfirmasi Kata Sandi"
                        type={showPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Ulangi kata sandi"
                        icon={Lock}
                        error={errors.password_confirmation}
                        required={!isEdit && !!data.password}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                </div>

                {/* Actions Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={processing}
                        onClick={onClose}
                    >
                        Batal
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={processing}
                        icon={isEdit ? Save : UserPlus}
                    >
                        {processing
                            ? 'Menyimpan...'
                            : isEdit
                            ? 'Simpan Perubahan'
                            : 'Tambah Pengguna'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
