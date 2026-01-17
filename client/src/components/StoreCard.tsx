import Link from 'next/link';
import Image from 'next/image';

interface StoreCardProps {
    store: {
        _id: string;
        name: string;
        category: string;
        heroImageUrl?: string;
        location: {
            floorLevel: number;
        };
        isOpen: boolean;
    };
}

export default function StoreCard({ store }: StoreCardProps) {
    return (
        <Link href={`/stores/${store._id}`} className="group block h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 h-full flex flex-col">
                {/* Image Area */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {store.heroImageUrl ? (
                        <Image
                            src={store.heroImageUrl}
                            alt={store.name}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <span className="text-4xl font-light">{store.name.charAt(0)}</span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${store.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {store.isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                                {store.category}
                            </p>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {store.name}
                            </h3>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Level {store.location.floorLevel}
                        </span>
                        <span className="text-gray-400">
                            &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
