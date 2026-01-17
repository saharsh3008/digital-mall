'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { AnalyticsEventType } from '@/lib/analytics';

interface ParkingZone {
    id: string;
    level: string;
    totalSpots: number;
    availableSpots: number;
    occupancyRate: number;
    type: string;
}

export default function ParkingPage() {
    const [zones, setZones] = useState<ParkingZone[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchParking = async () => {
        try {
            const res = await fetchAPI('/parking');
            setZones(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParking();
        // Poll every 5 seconds for "Real Time" feel
        const interval = setInterval(fetchParking, 5000);
        return () => clearInterval(interval);
    }, []);

    const totalAvailable = zones.reduce((acc, z) => acc + z.availableSpots, 0);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 pb-20">
            <AnalyticsTracker eventType={AnalyticsEventType.EVENT_VIEW} metadata={{ page: 'Parking' }} />

            <div className="max-w-4xl mx-auto space-y-8 mt-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Smart Parking</h1>
                        <p className="text-gray-400 mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live Updates from Sensors
                        </p>
                    </div>

                    {/* Big Counter */}
                    <div className="text-right mt-6 md:mt-0">
                        <span className="text-6xl font-mono font-bold text-green-400">{totalAvailable}</span>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Spots Available</p>
                    </div>
                </div>

                {/* Zones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {zones.map(zone => (
                        <div key={zone.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 relative overflow-hidden">
                            {/* Progress Bar Background */}
                            <div
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-red-500 transition-all duration-1000"
                                style={{ width: `${zone.occupancyRate}%` }}
                            />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${zone.type === 'EV Charging' ? 'bg-blue-500/20 text-blue-400' :
                                            zone.type === 'Disabled' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-gray-700 text-gray-300'
                                        }`}>
                                        {zone.type}
                                    </span>
                                    <h3 className="text-2xl font-bold mt-2">Level {zone.level}</h3>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl border-4 ${zone.occupancyRate > 90 ? 'border-red-500 text-red-500' :
                                        zone.occupancyRate > 70 ? 'border-orange-500 text-orange-500' :
                                            'border-green-500 text-green-500'
                                    }`}>
                                    {zone.availableSpots}
                                </div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-400 font-mono">
                                <span>Occupancy</span>
                                <span>{zone.occupancyRate}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Card */}
                <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl flex gap-4 items-start">
                    <div className="text-2xl">⚡</div>
                    <div>
                        <h4 className="font-bold text-blue-100">Did you know?</h4>
                        <p className="text-blue-300 text-sm mt-1">
                            Level B1 has 4 ultra-fast EV chargers available. First 2 hours of charging are complimentary for mall guests.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
