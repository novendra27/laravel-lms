import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, User as UserIcon, LogOut, ChevronDown, Bell } from 'lucide-react';
import Badge from '../UI/Badge';

export default function TopBar({ onMenuClick, title = '' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roleVariant = user?.is_admin
        ? 'admin'
        : user?.is_instructor
        ? 'instructor'
        : 'student';

    const roleLabel = user?.is_admin
        ? 'Administrator'
        : user?.is_instructor
        ? 'Instruktur'
        : 'Peserta';

    return (
        <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            {/* Left Section: Mobile Menu & Title */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                    aria-label="Buka navigasi"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {title && (
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                        {title}
                    </h1>
                )}
            </div>

            {/* Right Section: Role Badge & Profile Dropdown */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Role Badge */}
                {user && (
                    <Badge variant={roleVariant} size="md" className="hidden sm:inline-flex">
                        {roleLabel}
                    </Badge>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 rounded-full p-1 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <img
                            src={
                                user?.avatar_url ||
                                'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
                            }
                            alt={user?.name || 'User'}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                        />
                        <span className="hidden md:block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                            {user?.name}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 ring-1 ring-black/5 z-50 animate-scaleUp">
                            <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                    {user?.email}
                                </p>
                                <div className="mt-2 sm:hidden">
                                    <Badge variant={roleVariant} size="sm">
                                        {roleLabel}
                                    </Badge>
                                </div>
                            </div>

                            <Link
                                href="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                                <UserIcon className="h-4 w-4 text-slate-400" />
                                <span>Pengaturan Profil</span>
                            </Link>

                            <div className="my-1 border-t border-slate-100" />

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                onClick={() => setDropdownOpen(false)}
                                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Keluar</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
