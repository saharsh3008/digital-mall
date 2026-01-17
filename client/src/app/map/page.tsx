'use client';

import { useState } from 'react';

const FLOORS = [1, 2, 3, 4];

interface Unit {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    type: 'store' | 'anchor' | 'kiosk' | 'amenity';
}

// Generate a procedural floor plan (Moved outside for perf)
const getFloorUnits = (floor: number): Unit[] => {
    const units: Unit[] = [];

    // Anchor Store (Left)
    units.push({ id: `${floor}-anchor-l`, x: 20, y: 150, width: 140, height: 300, label: floor === 1 ? 'Dept. Store' : `Anchor ${floor}A`, type: 'anchor' });

    // Anchor Store (Right)
    units.push({ id: `${floor}-anchor-r`, x: 840, y: 150, width: 140, height: 300, label: floor === 4 ? 'Cinema' : `Anchor ${floor}B`, type: 'anchor' });

    // Top Row Shops
    for (let i = 0; i < 6; i++) {
        units.push({
            id: `${floor}-top-${i}`,
            x: 180 + (i * 110),
            y: 20,
            width: 100,
            height: 100,
            label: `Shop ${floor}0${i}`,
            type: 'store'
        });
    }

    // Bottom Row Shops
    for (let i = 0; i < 6; i++) {
        units.push({
            id: `${floor}-btm-${i}`,
            x: 180 + (i * 110),
            y: 480,
            width: 100,
            height: 100,
            label: `Shop ${floor}1${i}`,
            type: 'store'
        });
    }

    // Center Kiosks
    units.push({ id: `${floor}-k1`, x: 350, y: 280, width: 40, height: 40, label: 'Coffee', type: 'kiosk' });
    units.push({ id: `${floor}-k2`, x: 610, y: 280, width: 40, height: 40, label: 'Info', type: 'kiosk' });

    return units;
};

export default function MapPage() {
    const [activeFloor, setActiveFloor] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const units = getFloorUnits(activeFloor);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar Controls (Restored) */}
            <div className="w-full md:w-80 bg-white p-6 shadow-xl z-20 flex flex-col gap-6 md:h-screen sticky top-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Mall Navigator</h1>
                    <p className="text-gray-500 text-sm">Interactive Blueprint</p>
                </div>

                {/* Floor Selector */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Level</label>
                    <div className="flex gap-2 flex-wrap">
                        {FLOORS.map(floor => (
                            <button
                                key={floor}
                                onClick={() => { setActiveFloor(floor); setSelectedUnit(null); }}
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
                        <span className="w-4 h-4 rounded border-2 border-blue-500 bg-white"></span> Store
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="w-4 h-4 rounded border-2 border-gray-400 bg-gray-100"></span> Anchor / Service
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="text-lg">🚹</span> Amenities
                    </div>
                </div>

                {/* Selected Info */}
                {selectedUnit ? (
                    <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 text-lg">{selectedUnit.label}</h3>
                            <button onClick={() => setSelectedUnit(null)} className="text-blue-400 hover:text-blue-600">×</button>
                        </div>
                        <p className="text-sm text-blue-600 mb-3">Level {activeFloor} • {selectedUnit.type}</p>
                        <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm">
                            Navigate Here
                        </button>
                    </div>
                ) : (
                    <div className="mt-auto p-4 border border-dashed border-gray-300 rounded-xl text-center text-gray-400 text-sm">
                        Select a unit on the blueprint to view details
                    </div>
                )}
            </div>

            {/* Map Canvas */}
            <div className="flex-1 bg-[#f0f2f5] relative overflow-hidden flex items-center justify-center p-4 md:p-8 cursor-grab active:cursor-grabbing">
                {/* Blueprint Container */}
                <div className="bg-white shadow-2xl rounded-sm w-full max-w-5xl aspect-[16/9] relative overflow-hidden border border-gray-300 transform transition-transform hover:scale-[1.01] duration-500">

                    {/* Blueprint Grid Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                    <svg viewBox="0 0 1000 600" className="w-full h-full">
                        {/* Structural Base */}
                        <rect x="0" y="0" width="1000" height="600" fill="none" />

                        {/* Corridors */}
                        <path d="M160,120 L840,120 L840,480 L160,480 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

                        {/* Atrium Void */}
                        <rect x="400" y="200" width="200" height="200" rx="4" fill="#e0f2fe" opacity="0.3" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                        <text x="500" y="300" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.5">ATRIUM</text>

                        {/* Units */}
                        {units.map(unit => (
                            <g
                                key={unit.id}
                                onClick={() => setSelectedUnit(unit)}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                {/* Unit Shape */}
                                <rect
                                    x={unit.x}
                                    y={unit.y}
                                    width={unit.width}
                                    height={unit.height}
                                    fill={selectedUnit?.id === unit.id ? '#2563eb' : (unit.type === 'anchor' ? '#e2e8f0' : '#fff')}
                                    stroke={selectedUnit?.id === unit.id ? '#1e40af' : '#64748b'}
                                    strokeWidth={selectedUnit?.id === unit.id ? '3' : '1'}
                                />

                                {/* Door Indicators */}
                                {unit.y < 100 && <line x1={unit.x + unit.width / 2 - 10} y1={unit.y + unit.height} x2={unit.x + unit.width / 2 + 10} y2={unit.y + unit.height} stroke={selectedUnit?.id === unit.id ? '#2563eb' : '#fff'} strokeWidth="4" />}
                                {unit.y > 400 && <line x1={unit.x + unit.width / 2 - 10} y1={unit.y} x2={unit.x + unit.width / 2 + 10} y2={unit.y} stroke={selectedUnit?.id === unit.id ? '#2563eb' : '#fff'} strokeWidth="4" />}

                                {/* Label */}
                                <text
                                    x={unit.x + unit.width / 2}
                                    y={unit.y + unit.height / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="11"
                                    fontWeight="500"
                                    fill={selectedUnit?.id === unit.id ? 'white' : '#475569'}
                                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                                >
                                    {unit.label}
                                </text>
                            </g>
                        ))}

                        {/* Static Amenities */}
                        <g transform="translate(900, 30)">
                            <circle cx="20" cy="20" r="15" fill="#f1f5f9" stroke="#94a3b8" />
                            <text x="20" y="25" textAnchor="middle" fontSize="12">🚹</text>
                        </g>
                    </svg>

                    {/* Scale Marker */}
                    <div className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 text-[10px] border border-gray-300 rounded font-mono text-gray-500">
                        1:100 SCALE
                    </div>
                </div>
            </div>
        </div>
    );
}
