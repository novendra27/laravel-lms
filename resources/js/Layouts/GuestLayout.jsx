import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import FlashMessage from '../Components/UI/FlashMessage';

export default function GuestLayout({ children, title = '' }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
            <Head title={title ? `${title} - LMS App` : 'LMS App'} />

            <FlashMessage />

            {/* Background Decorative Blur Rings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 right-0 w-[500px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Brand Logo Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 group transition-transform duration-200 hover:scale-105 mb-4"
                >
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                        <span className="text-2xl font-black tracking-tight text-white block">
                            LMS<span className="text-indigo-400">App</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                            Learning Management System
                        </span>
                    </div>
                </Link>

                {title && (
                    <h2 className="text-xl font-bold tracking-tight text-white/90">
                        {title}
                    </h2>
                )}
            </div>

            {/* Card Container */}
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
                <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
                    {children}
                </div>

                <div className="mt-8 text-center text-xs text-slate-400 font-medium">
                    &copy; {new Date().getFullYear()} LMS App. Hak Cipta Dilindungi.
                </div>
            </div>
        </div>
    );
}
