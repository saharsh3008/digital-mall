import { fetchAPI } from '@/lib/api';
import Image from 'next/image';

interface Event {
    _id: string;
    title: string;
    description: string;
    bannerUrl?: string;
    startDate: string;
    endDate: string;
    locationName: string;
    tags?: string[];
}

async function getEvents() {
    try {
        const res = await fetchAPI('/events');
        return res.data;
    } catch (error) {
        return [];
    }
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-purple-900 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Events & Happenings</h1>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                        From live concerts to exclusive pop-up shops, see what's happening at The Digital Mall this week.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-12">
                    {events.length > 0 ? (
                        events.map((event: Event) => (
                            <div key={event._id} className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                                {/* Date Badge (Mobile Overlay / Desktop Sidebar) */}
                                <div className="absolute top-4 left-4 md:static md:w-32 bg-purple-50 md:bg-white flex flex-col items-center justify-center p-4 z-10 rounded-xl md:rounded-none md:border-r border-gray-100">
                                    <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">
                                        {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-gray-900 font-bold text-3xl">
                                        {new Date(event.startDate).getDate()}
                                    </span>
                                    <span className="text-gray-400 text-xs mt-1">
                                        {new Date(event.startDate).getFullYear()}
                                    </span>
                                </div>

                                {/* Image */}
                                <div className="relative h-64 md:h-auto md:w-1/3 overflow-hidden">
                                    <div className="absolute inset-0 bg-gray-200" />
                                    {event.bannerUrl && (
                                        <Image
                                            src={event.bannerUrl}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-8 flex flex-col justify-center">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {event.tags && event.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                                        {event.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center gap-6 text-sm text-gray-500 mt-auto">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.locationName}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="p-8 flex items-center border-t md:border-t-0 md:border-l border-gray-100">
                                    <button className="whitespace-nowrap px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
                                        Get Tickets
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500">No upcoming events found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
