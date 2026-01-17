'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Basic Client-side Protection
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-4 bg-gray-300 rounded-full mb-2"></div>
                    <p className="text-gray-400 text-sm">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar Stub */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Tenant Portal</h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Overview</a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Store Profile</a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Offers</a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Analytics</a>
                </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    );
}
