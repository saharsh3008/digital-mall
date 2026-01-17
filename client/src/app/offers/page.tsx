import { fetchAPI } from "@/lib/api";
import { AnalyticsEventType } from "@/lib/analytics";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Image from "next/image";

interface Offer {
    _id: string;
    title: string;
    description: string;
    code: string;
    validUntil: string;
    store: {
        name: string;
        heroImageUrl?: string;
        category: string;
    };
}

async function getOffers() {
    try {
        const res = await fetchAPI('/offers');
        return res.data;
    } catch (error) {
        console.error('Failed to fetch offers', error);
        return [];
    }
}

export default async function OffersPage() {
    const offers = await getOffers();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <AnalyticsTracker eventType={AnalyticsEventType.EVENT_VIEW} metadata={{ page: 'Offers' }} />

            <div className="max-w-7xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Exclusive Flash Sales
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500">
                        Limited time deals from your favorite brands. Show the code at checkout.
                    </p>
                </div>

                {offers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No active offers right now. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer: Offer) => (
                            <div key={offer._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                {/* Store Image Header */}
                                <div className="h-40 bg-gray-200 relative">
                                    {offer.store.heroImageUrl && (
                                        <Image
                                            src={offer.store.heroImageUrl}
                                            alt={offer.store.name}
                                            fill
                                            className="object-cover opacity-90"
                                        />
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800">
                                        {offer.store.name}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                                    <p className="text-gray-600 text-sm mb-6 flex-1">{offer.description}</p>

                                    {/* Coupon Code Box */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center relative group cursor-pointer border-dashed border-2">
                                        <span className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Coupon Code</span>
                                        <code className="text-2xl font-mono font-bold text-blue-700 tracking-widest">{offer.code}</code>

                                        {/* Expire Date */}
                                        <div className="mt-2 text-xs text-gray-400">
                                            Expires {new Date(offer.validUntil).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
