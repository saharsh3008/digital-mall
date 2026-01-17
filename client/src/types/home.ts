import Link from 'next/link';

interface Store {
    _id: string;
    name: string;
    category: string;
    heroImageUrl?: string;
    location: { floorLevel: number };
}

interface Event {
    _id: string;
    title: string;
    startDate: string;
    locationName: string;
}

// Add Offer Interface
interface Offer {
    _id: string;
    title: string;
    code: string;
    store: { name: string; heroImageUrl?: string };
    validUntil: string;
}
