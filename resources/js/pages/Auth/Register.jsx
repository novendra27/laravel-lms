import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import GuestLayout from '../../Layouts/GuestLayout';
import TextInput from '../../Components/UI/TextInput';
import Button from '../../Components/UI/Button';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title="Daftar Akun Siswa Baru">
            <Head title="Daftar Akun" />

            <div className="mb-5 text-center">
                <p className="text-xs text-slate-500">
                    Bergabunglah bersama ribuan siswa lainnya untuk mempelajari skill teknologi terkini.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input */}
                <TextInput
                    label="Nama Lengkap"
                    type="text"
                    name="name"
                    value={data.name}
                    placeholder="Contoh: Budi Pratama"
                    icon={User}
                    error={errors.name}
                    autoComplete="name"
                    required
                    onChange={(e) => setData('name', e.target.value)}
                />

                {/* Email Input */}
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

                {/* Password Input */}
                <TextInput
                    label="Kata Sandi"
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

                {/* Password Confirmation Input */}
                <TextInput
                    label="Konfirmasi Kata Sandi"
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={data.password_confirmation}
                    placeholder="Ulangi kata sandi"
                    icon={Lock}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    required
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                {/* Terms Notice */}
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi platform pembelajaran kami.
                </p>

                {/* Submit Button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={processing}
                        icon={UserPlus}
                        className="w-full shadow-md shadow-indigo-500/20"
                    >
                        {processing ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
                    </Button>
                </div>
            </form>

            {/* Login Footer Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
                Sudah memiliki akun?{' '}
                <Link
                    href="/login"
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Masuk ke Akun Anda
                </Link>
            </div>
        </GuestLayout>
    );
}
