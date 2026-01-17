import { fetchAPI } from '@/lib/api';
import DirectoryGrid from './DirectoryGrid';

async function getStores() {
    try {
        const res = await fetchAPI('/stores?limit=100'); // Fetch all for client-side filtering (MVP)
        return res.data;
    } catch (error) {
        console.error('Failed to fetch stores:', error);
        return [];
    }
}

export default async function DirectoryPage() {
    const stores = await getStores();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Store Directory</h1>
                    <p className="mt-2 text-gray-500">Find your favorite brands and discover new ones.</p>
                </div>

                <DirectoryGrid initialStores={stores} />
            </div>
        </div>
    );
}
