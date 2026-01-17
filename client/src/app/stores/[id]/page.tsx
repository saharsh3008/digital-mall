import { fetchAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { AnalyticsEventType } from '@/lib/analytics';

interface Props {
    params: { id: string };
}

async function getStore(id: string) {
    try {
        const res = await fetchAPI(`/stores/${id}`);
        return res.data;
    } catch (error) {
        return null;
    }
}

export default async function StoreDetailPage({ params }: Props) {
    const store = await getStore(params.id);

    if (!store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Not Found</h1>
                    <Link href="/directory" className="text-blue-600 hover:underline">
                        &larr; Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    return (
        <div className="min-h-screen bg-white">
            {/* Tracking */}
            <AnalyticsTracker
                eventType={AnalyticsEventType.STORE_VIEW}
                entityId={store._id}
                metadata={{ name: store.name, category: store.category }}
            />

            {/* Hero Banner */}
            <div className="relative h-[40vh] bg-gray-900">
                {store.heroImageUrl && (
                    <Image
                        src={store.heroImageUrl}
                        alt={store.name}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="max-w-7xl mx-auto flex items-end gap-6">
                        {/* Logo Badge */}
                        <div className="relative w-32 h-32 bg-white rounded-2xl shadow-xl p-2 -mb-16 overflow-hidden">
                            {store.logoUrl ? (
                                <Image src={store.logoUrl} alt={store.name + ' logo'} fill className="object-contain p-2" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-4xl">{store.name[0]}</div>
                            )}
                        </div>

                        <div className="mb-4 text-white">
                            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {store.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mt-2">{store.name}</h1>
                            <p className="text-gray-300 mt-1 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Level {store.location.floorLevel}, Unit {store.location.unitNumber}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">About</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {store.description}
                        </p>
                    </section>

                    {/* Offers (Placeholder for now) */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Current Offers</h2>
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border border-purple-100 border-dashed text-center">
                            <p className="text-purple-800 font-medium">No active offers right now.</p>
                            <p className="text-sm text-purple-600 mt-1">Check back later or visit the store!</p>
                        </div>
                        {/* Future: Map through store.offers array */}
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Opening Hours</h3>
                        <div className="space-y-3">
                            {days.map(day => (
                                <div key={day} className="flex justify-between text-sm">
                                    <span className="capitalize text-gray-500">{day}</span>
                                    <span className="font-medium text-gray-900">
                                        {store.operatingHours?.[day] ?
                                            `${store.operatingHours[day].open} - ${store.operatingHours[day].close}` :
                                            'Closed'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            Navigate to Store
                        </button>
                        <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
                            Share Profile
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
