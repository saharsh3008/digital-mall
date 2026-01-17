import { fetchAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    params: { id: string };
}

async function getEvent(id: string) {
    try {
        const res = await fetchAPI(`/events/${id}`);
        return res.data;
    } catch (error) {
        return null;
    }
}

export default async function EventDetailPage({ params }: Props) {
    const event = await getEvent(params.id);

    if (!event) return <div>Event not found</div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Immersive Hero */}
            <div className="relative h-[50vh] w-full">
                <div className="absolute inset-0 bg-gray-900" />
                {event.bannerUrl && (
                    <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        fill
                        className="object-cover opacity-70"
                    />
                )}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded uppercase mb-4 inline-block">
                            Upcoming Event
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                        <p className="text-gray-300 text-lg">{event.locationName}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="prose prose-lg text-gray-600">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h2>
                    <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
            </div>
        </div>
    );
}
