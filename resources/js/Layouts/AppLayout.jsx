import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../Components/Navigation/Sidebar';
import TopBar from '../Components/Navigation/TopBar';
import FlashMessage from '../Components/UI/FlashMessage';

export default function AppLayout({
    children,
    title = '',
    headerRight = null,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white flex">
            <Head title={title ? `${title} - LMS App` : 'LMS App'} />

            {/* Global Flash Alerts */}
            <FlashMessage />

            {/* Sidebar Navigation */}
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
                <TopBar
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
