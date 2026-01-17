import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface Store {
  _id: string;
  name: string;
  category: string;
  heroImageUrl?: string;
  logoUrl?: string;
  location: { floorLevel: number };
}

interface Event {
  _id: string;
  title: string;
  startDate: string;
  locationName: string;
  bannerUrl?: string;
}

async function getData() {
  try {
    const [storesData, eventsData] = await Promise.all([
      fetchAPI('/stores?limit=3'),
      fetchAPI('/events?limit=3')
    ]);
    return {
      stores: storesData.data,
      events: eventsData.data
    };
  } catch (error) {
    console.error('Failed to fetch data', error);
    return { stores: [], events: [] };
  }
}

export default async function Home() {
  const { stores, events } = await getData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-r from-purple-800 to-blue-900" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            The Mall, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Experience shopping like never before. Real-time navigation, exclusive flash offers, and seamless parking.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/directory" className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition shadow-lg">
              Explore Stores
            </Link>
            <Link href="/map" className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold rounded-full hover:bg-white/20 transition">
              Find My Way
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Editor's Picks</h2>
            <p className="text-gray-500">Trending spots this week.</p>
          </div>
          <Link href="/directory" className="text-blue-600 font-medium hover:underline">
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stores.length > 0 ? (
            stores.map((store: Store) => (
              <Link key={store._id} href={`/stores/${store._id}`} className="group block">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  {store.heroImageUrl && (
                    <Image
                      src={store.heroImageUrl}
                      alt={store.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  )}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {store.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {store.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Floor {store.location.floorLevel} • Open Now
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">No stores found. (Did you run the seed script?)</p>
            </div>
          )}
        </div>
      </section>

      {/* Flash Sales Teaser */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss Out!</h2>
            <p className="text-blue-100 text-lg max-w-md">Exclusive flash deals from brands like Nike, Sephora, and Starbucks are live now.</p>
          </div>
          <Link href="/offers" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
            <span>View All 4 Deals</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Happening Now</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event: Event) => (
              <div key={event._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/3 aspect-square bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold text-2xl">
                  {new Date(event.startDate).getDate()}
                  <span className="text-sm font-normal ml-1">
                    {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-500 mb-4">{event.locationName}</p>
                  <button className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                    Add to Calendar &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
