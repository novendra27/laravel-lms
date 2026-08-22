import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import GuestLayout from '../../Layouts/GuestLayout';
import TextInput from '../../Components/UI/TextInput';
import Button from '../../Components/UI/Button';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title="Atur Ulang Kata Sandi">
            <Head title="Reset Kata Sandi" />

            <div className="mb-5 text-center">
                <p className="text-xs text-slate-500 leading-relaxed">
                    Silakan masukkan kata sandi baru untuk akun Anda.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Alamat Email"
                    type="email"
                    name="email"
                    value={data.email}
                    placeholder="nama@domain.com"
                    icon={Mail}
                    error={errors.email}
                    autoComplete="username"
                    required
                    onChange={(e) => setData('email', e.target.value)}
                />

                <TextInput
                    label="Kata Sandi Baru"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={data.password}
                    placeholder="Minimal 8 karakter"
                    icon={Lock}
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
                    icon={Lock}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    required
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={processing}
                        icon={KeyRound}
                        className="w-full shadow-md shadow-indigo-500/20"
                    >
                        {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
