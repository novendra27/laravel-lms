import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import GuestLayout from '../../Layouts/GuestLayout';
import TextInput from '../../Components/UI/TextInput';
import Button from '../../Components/UI/Button';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout title="Lupa Kata Sandi">
            <Head title="Lupa Kata Sandi" />

            <div className="mb-5 text-center">
                <p className="text-xs text-slate-500 leading-relaxed">
                    Masukkan alamat email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                </p>
            </div>

            {status && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 animate-fadeIn">
                    {status}
                </div>
            )}

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

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={processing}
                        icon={Send}
                        className="w-full shadow-md shadow-indigo-500/20"
                    >
                        {processing ? 'Mengirim Link...' : 'Kirim Link Reset Password'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Kembali ke Halaman Masuk</span>
                </Link>
            </div>
        </GuestLayout>
    );
}
