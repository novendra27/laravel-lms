import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    BookOpenCheck,
    CheckSquare,
    Users,
    Layers,
    Activity,
    Settings,
    User,
    LogOut,
    X,
    Sparkles,
} from 'lucide-react';
import Badge from '../UI/Badge';

export default function Sidebar({ open = false, onClose }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const user = auth?.user;

    const isActive = (path) => {
        if (path === '/' || path === '/dashboard') {
            return url === '/' || url === '/dashboard';
        }
        return url.startsWith(path);
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div>
                    <div className="flex h-18 items-center justify-between px-6 border-b border-slate-800/80">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-lg font-black tracking-tight text-white block">
                                    LMS<span className="text-indigo-400">App</span>
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                                    Learning Platform
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <div className="px-4 py-6 space-y-7 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin scrollbar-thumb-slate-800">
                        {/* Section 1: Overview */}
                        <div>
                            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Overview
                            </div>
                            <nav className="space-y-1">
                                <SidebarLink
                                    href="/"
                                    icon={LayoutDashboard}
                                    active={isActive('/')}
                                >
                                    Dashboard
                                </SidebarLink>
                            </nav>
                        </div>

                        {/* Section 2: Student Learning Area */}
                        {user?.is_student && (
                            <div>
                                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Area Belajar
                                </div>
                                <nav className="space-y-1">
                                    <SidebarLink
                                        href="/my-courses"
                                        icon={BookOpen}
                                        active={isActive('/my-courses')}
                                    >
                                        Kursus Saya
                                    </SidebarLink>
                                    <SidebarLink
                                        href="/catalog"
                                        icon={GraduationCap}
                                        active={isActive('/catalog')}
                                    >
                                        Katalog Kursus
                                    </SidebarLink>
                                </nav>
                            </div>
                        )}

                        {/* Section 3: Instructor Teaching Area */}
                        {user?.is_instructor && (
                            <div>
                                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Pengajaran
                                </div>
                                <nav className="space-y-1">
                                    <SidebarLink
                                        href="/courses"
                                        icon={BookOpenCheck}
                                        active={isActive('/courses')}
                                    >
                                        Manajemen Kursus
                                    </SidebarLink>
                                    <SidebarLink
                                        href="/categories"
                                        icon={Layers}
                                        active={isActive('/categories')}
                                    >
                                        Kategori Kursus
                                    </SidebarLink>
                                </nav>
                            </div>
                        )}

                        {/* Section 4: Super Admin Area */}
                        {user?.is_admin && (
                            <div>
                                <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Administrasi
                                </div>
                                <nav className="space-y-1">
                                    <SidebarLink
                                        href="/users"
                                        icon={Users}
                                        active={isActive('/users')}
                                    >
                                        Manajemen User
                                    </SidebarLink>
                                    <SidebarLink
                                        href="/courses"
                                        icon={BookOpenCheck}
                                        active={isActive('/courses')}
                                    >
                                        Semua Kursus
                                    </SidebarLink>
                                    <SidebarLink
                                        href="/categories"
                                        icon={Layers}
                                        active={isActive('/categories')}
                                    >
                                        Kelola Kategori
                                    </SidebarLink>
                                    <SidebarLink
                                        href="/activity-logs"
                                        icon={Activity}
                                        active={isActive('/activity-logs')}
                                    >
                                        Audit Log
                                    </SidebarLink>
                                    <SidebarLink
                                        href="/settings"
                                        icon={Settings}
                                        active={isActive('/settings')}
                                    >
                                        Pengaturan
                                    </SidebarLink>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom User Profile Section */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
                    <div className="flex items-center justify-between gap-3 px-2 py-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 min-w-0 group hover:opacity-90 transition-opacity"
                        >
                            <img
                                src={user?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}
                                alt={user?.name || 'User'}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                    {user?.name || 'Guest'}
                                </div>
                                <div className="truncate text-[11px] text-slate-400">
                                    {user?.is_admin
                                        ? 'Administrator'
                                        : user?.is_instructor
                                        ? 'Instruktur'
                                        : 'Siswa'}
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-lg p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Keluar"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

function SidebarLink({ href, icon: Icon, active = false, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
        >
            <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
            />
            <span className="truncate">{children}</span>
        </Link>
    );
}
