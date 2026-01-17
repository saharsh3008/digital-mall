import { fetchAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { AnalyticsEventType } from '@/lib/analytics';

interface Props {
    params: { id: string };
}

interface Offer {
    _id: string;
    title: string;
    description: string;
    code: string;
    validUntil: string;
    store: { _id: string; name: string };
}

async function getStoreData(id: string) {
    try {
        const [storeRes, offersRes] = await Promise.all([
            fetchAPI(`/stores/${id}`),
            fetchAPI(`/offers`) // Fetch all offers then filter
        ]);

        const filteredOffers = offersRes.data.filter((o: Offer) => o.store._id === id);

        return {
            store: storeRes.data,
            offers: filteredOffers
        };
    } catch (error) {
        return null; // Handle 404 or fetch error
    }
}

export default async function StoreDetailPage({ params }: Props) {
    const data = await getStoreData(params.id);

    if (!data || !data.store) {
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

    const { store, offers } = data;
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
                                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-sm border border-white/20">
                                    L{store.location.floorLevel} - {store.location.unitNumber}
                                </span>
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
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">About {store.name}</h2>
                        <div className="prose prose-lg text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <p>{store.description}</p>
                        </div>
                    </section>

                    {/* Active Offers */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Active Offers</h2>
                            {offers.length > 0 && (
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                    {offers.length} Live Deals
                                </span>
                            )}
                        </div>

                        {offers.length > 0 ? (
                            <div className="grid gap-4">
                                {offers.map((offer: Offer) => (
                                    <div key={offer._id} className="bg-white border-2 border-dashed border-red-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-red-400 transition-colors">
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                                            <p className="text-gray-600 mt-1">{offer.description}</p>
                                            <p className="text-xs text-gray-400 mt-2">Expires {new Date(offer.validUntil).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col items-center bg-red-50 p-4 rounded-lg min-w-[120px]">
                                            <span className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">Use Code</span>
                                            <span className="text-2xl font-mono font-bold text-red-600 tracking-wider bg-white px-2 py-1 rounded border border-red-100">{offer.code}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                                <p className="text-gray-500">No special offers available for this store at the moment.</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Opening Hours
                        </h3>
                        <div className="space-y-3">
                            {days.map(day => {
                                const hours = store.operatingHours?.[day];
                                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase() === day.substring(0, 3);

                                return (
                                    <div key={day} className={`flex justify-between text-sm py-1 ${isToday ? 'font-bold bg-blue-50 px-2 rounded -mx-2' : ''}`}>
                                        <span className={`capitalize ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>{day}</span>
                                        <span className={`${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sticky top-24">
                        <Link href="/map" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-xl flex items-center justify-center gap-2">
                            <span>Get Directions</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
