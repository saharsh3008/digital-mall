'use client';

import { useState } from 'react';
import StoreCard from '@/components/StoreCard';

interface DirectoryGridProps {
    initialStores: any[];
}

export default function DirectoryGrid({ initialStores }: DirectoryGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(initialStores.map((s) => s.category)))];

    // Client-side filtering
    const filteredStores = initialStores.filter((store) => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Filters Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search stores..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat as string}
                                onClick={() => setSelectedCategory(cat as string)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat as React.ReactNode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Results */}
            {filteredStores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredStores.map((store) => (
                        <StoreCard key={store._id} store={store} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-gray-300 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
                    <p className="text-gray-500">Try adjusting your search or category.</p>
                </div>
            )}
        </div>
    );
}
