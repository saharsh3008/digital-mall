'use client';

import { useState } from 'react';
import Image from 'next/image';

const FLOORS = [1, 2, 3, 4];

// Simple coordinate system for demo purposes
// In a real app, this would be GeoJSON
const POIs = [
    { id: '101', name: 'Nike', x: 20, y: 30, floor: 1, type: 'store' },
    { id: '102', name: 'Zara', x: 40, y: 30, floor: 1, type: 'store' },
    { id: '105', name: 'Apple', x: 70, y: 60, floor: 1, type: 'store' },
    { id: '108', name: 'Starbucks', x: 50, y: 50, floor: 1, type: 'cafe' },
    { id: '201', name: 'Uniqlo', x: 30, y: 40, floor: 2, type: 'store' },
    { id: '305', name: 'Sony', x: 60, y: 30, floor: 3, type: 'store' },
    { id: '401', name: 'McDonalds', x: 50, y: 50, floor: 4, type: 'food' },
    { id: 'e1', name: 'Elevator', x: 10, y: 10, floor: 1, type: 'amenity' },
    { id: 'r1', name: 'Restroom', x: 90, y: 10, floor: 1, type: 'amenity' },
];

export default function MapPage() {
    const [activeFloor, setActiveFloor] = useState(1);
    const [selectedPoi, setSelectedPoi] = useState<any>(null);

    const currentPois = POIs.filter(p => p.floor === activeFloor);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-white p-6 shadow-xl z-20 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Mall Navigator</h1>
                    <p className="text-gray-500 text-sm">Interactive Guide</p>
                </div>

                {/* Floor Selector */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Level</label>
                    <div className="flex gap-2">
                        {FLOORS.map(floor => (
                            <button
                                key={floor}
                                onClick={() => setActiveFloor(floor)}
                                className={`w-12 h-12 rounded-xl font-bold transition-all ${activeFloor === floor
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                L{floor}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Legend</label>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> Store
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span> Dining
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="w-3 h-3 rounded-full bg-gray-400"></span> Amenities
                    </div>
                </div>

                {/* Selected Info */}
                {selectedPoi ? (
                    <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                        <h3 className="font-bold text-gray-900">{selectedPoi.name}</h3>
                        <p className="text-sm text-blue-600">Level {selectedPoi.floor}</p>
                        <button className="mt-3 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                            Navigate Here
                        </button>
                    </div>
                ) : (
                    <div className="mt-auto p-4 border border-dashed border-gray-300 rounded-xl text-center text-gray-400 text-sm">
                        Select a location on the map
                    </div>
                )}
            </div>

            {/* Map Canvas */}
            <div className="flex-1 relative overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing">
                {/* Placeholder SVG Map Background */}
                <div className="absolute inset-8 bg-white rounded-3xl shadow-sm border-2 border-gray-200 p-8 transform transition-all">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div className="relative w-full h-full">
                        {/* Structural Walls (Abstract) */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-800"></div>
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800"></div>
                        <div className="absolute top-0 left-0 h-full w-2 bg-gray-800"></div>
                        <div className="absolute top-0 right-0 h-full w-2 bg-gray-800"></div>

                        {/* POI Markers */}
                        {currentPois.map(poi => (
                            <button
                                key={poi.id}
                                onClick={() => setSelectedPoi(poi)}
                                className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-125 ${selectedPoi?.id === poi.id ? 'ring-4 ring-blue-200 z-10 scale-125' : ''
                                    } ${poi.type === 'store' ? 'bg-blue-500 text-white' :
                                        poi.type === 'food' || poi.type === 'cafe' ? 'bg-orange-500 text-white' :
                                            'bg-gray-400 text-white'
                                    }`}
                                style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                            >
                                {poi.type === 'amenity' ? (
                                    <span className="text-xs">?</span>
                                ) : (
                                    <span className="text-[10px] font-bold">{poi.name[0]}</span>
                                )}

                                {/* Label */}
                                <span className="absolute top-full mt-1 bg-gray-900 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                                    {poi.name}
                                </span>
                            </button>
                        ))}

                        {/* "You Are Here" Marker */}
                        <div className="absolute left-[50%] top-[90%] flex flex-col items-center">
                            <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
                            <span className="bg-white/80 px-2 py-0.5 rounded text-xs font-bold shadow-sm mt-1">You</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
