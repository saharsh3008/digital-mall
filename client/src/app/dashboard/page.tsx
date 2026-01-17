'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [topStores, setTopStores] = useState<any[]>([]);
    const [topSearches, setTopSearches] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Parallel fetch
                const [storesRes, searchesRes, activityRes] = await Promise.all([
                    fetchAPI('/admin/analytics/top-stores', { headers }),
                    fetchAPI('/admin/analytics/top-searches', { headers }),
                    fetchAPI('/admin/analytics/activity', { headers })
                ]);

                setTopStores(storesRes.data);
                setTopSearches(searchesRes.data);
                setActivity(activityRes.data);
            } catch (err) {
                console.error('Failed to load analytics', err);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    // Helper for simple bar chart
    const maxActivity = Math.max(...activity.map((d: any) => d.totalEvents), 1);

    if (loading) return <div className="p-8 text-gray-500">Loading analytics...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Total Events (30d)</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {activity.reduce((acc, curr) => acc + curr.totalEvents, 0)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Store Views</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {activity.reduce((acc, curr) => acc + curr.storeViews, 0)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Search Queries</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {activity.reduce((acc, curr) => acc + curr.searches, 0)}
                    </p>
                </div>
            </div>

            {/* Activity Chart (CSS only, no external lib) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">Traffic Over Time (30 Days)</h3>
                <div className="h-48 flex items-end gap-1">
                    {activity.map((day: any) => (
                        <div key={day._id} className="flex-1 flex flex-col items-center group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                                {day._id}: {day.totalEvents} events
                            </div>
                            {/* Bar */}
                            <div
                                className="w-full bg-blue-100 hover:bg-blue-500 transition-colors rounded-t-sm"
                                style={{ height: `${(day.totalEvents / maxActivity) * 100}%` }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{activity[0]?._id}</span>
                    <span>{activity[activity.length - 1]?._id}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Stores */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Most Popular Stores</h3>
                    <div className="space-y-4">
                        {topStores.map((store, i) => (
                            <div key={store.storeId} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 font-mono text-sm w-4">{i + 1}</span>
                                    <div>
                                        <p className="font-medium text-gray-900">{store.name}</p>
                                        <p className="text-xs text-gray-500">{store.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-gray-900">{store.views}</span>
                                    <span className="text-xs text-gray-500 ml-1">views</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Searches */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Top Search Queries</h3>
                    <div className="space-y-3">
                        {topSearches.map((term, i) => (
                            <div key={term.query} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 font-mono text-sm w-4">{i + 1}</span>
                                    <p className="font-medium text-gray-800 capitalize group-hover:text-blue-600">
                                        {term.query}
                                    </p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                    {term.count}
                                </span>
                            </div>
                        ))}
                        {topSearches.length === 0 && (
                            <p className="text-gray-400 text-sm">No search data yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
