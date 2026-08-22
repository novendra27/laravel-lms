import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldAlert, BookOpen, GraduationCap } from 'lucide-react';
import GuestLayout from '../../Layouts/GuestLayout';
import TextInput from '../../Components/UI/TextInput';
import Button from '../../Components/UI/Button';

export default function Login({ status, canResetPassword = true }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    // Quick demo login filler
    const fillDemo = (email, password = 'password') => {
        setData({
            email,
            password,
            remember: true,
        });
    };

    return (
        <GuestLayout title="Masuk ke Akun Anda">
            <Head title="Masuk" />

            {status && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 animate-fadeIn">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.password}
                    autoComplete="current-password"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                        />
                        <span className="text-xs text-slate-600 font-medium">
                            Ingat Saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                        >
                            Lupa Kata Sandi?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={processing}
                        icon={LogIn}
                        className="w-full shadow-md shadow-indigo-500/20"
                    >
                        {processing ? 'Memverifikasi...' : 'Masuk Sekarang'}
                    </Button>
                </div>
            </form>

            {/* Quick Demo Login Section for Instant Testing */}
            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="text-center mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 bg-white px-2">
                        ⚡ Quick Demo Accounts
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => fillDemo('admin@lms.test')}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-center group"
                    >
                        <ShieldAlert className="h-4 w-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-800">Admin</span>
                        <span className="text-[10px] text-slate-500">Super Admin</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('instructor@lms.test')}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-purple-50 hover:border-purple-200 transition-all text-center group"
                    >
                        <BookOpen className="h-4 w-4 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-800">Instruktur</span>
                        <span className="text-[10px] text-slate-500">Budi Santoso</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('student@lms.test')}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-sky-50 hover:border-sky-200 transition-all text-center group"
                    >
                        <GraduationCap className="h-4 w-4 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-800">Siswa</span>
                        <span className="text-[10px] text-slate-500">Ahmad Rizky</span>
                    </button>
                </div>
            </div>

            {/* Register Footer Link */}
            <div className="mt-6 text-center text-xs text-slate-600">
                Belum memiliki akun?{' '}
                <Link
                    href="/register"
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Daftar Akun Siswa Baru
                </Link>
            </div>
        </GuestLayout>
    );
}
