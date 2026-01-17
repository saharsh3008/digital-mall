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

// Generate a procedural floor plan
const getFloorUnits = (floor: number): Unit[] => {
    const units: Unit[] = [];

    // Anchor Store (Left)
    units.push({ id: `${floor}-anchor-l`, x: 20, y: 150, width: 140, height: 300, label: floor === 1 ? 'Department Store' : `Anchor ${floor}A`, type: 'anchor' });

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
        <div className="min-h-screen bg-gray-50 flex flex-col items-stretch">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center z-10 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Digital Mall Map</h1>
                    <p className="text-sm text-gray-500">Interactive Blueprint</p>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                    {FLOORS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFloor(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeFloor === f
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Level {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Map Canvas */}
                <div className="flex-1 bg-[#f0f2f5] relative overflow-hidden flex items-center justify-center p-8">
                    <div className="bg-white shadow-2xl rounded-sm w-full max-w-5xl aspect-[16/9] relative overflow-hidden border border-gray-300">
                        {/* Blueprint Pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        />

                        <svg viewBox="0 0 1000 600" className="w-full h-full">
                            {/* Floor Base */}
                            <rect x="0" y="0" width="1000" height="600" fill="none" />

                            {/* Corridors (Negative Space logic visualized as floor) */}
                            <path d="M160,120 L840,120 L840,480 L160,480 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

                            {/* Atrium Hole */}
                            <rect x="400" y="200" width="200" height="200" rx="20" fill="#e0f2fe" opacity="0.5" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                            <text x="500" y="300" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold" opacity="0.6">ATRIUM OPEN TO BELOW</text>

                            {/* Units */}
                            {units.map(unit => (
                                <g
                                    key={unit.id}
                                    onClick={() => setSelectedUnit(unit)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <rect
                                        x={unit.x}
                                        y={unit.y}
                                        width={unit.width}
                                        height={unit.height}
                                        fill={selectedUnit?.id === unit.id ? '#3b82f6' : (unit.type === 'anchor' ? '#e2e8f0' : '#fff')}
                                        stroke={selectedUnit?.id === unit.id ? '#2563eb' : '#64748b'}
                                        strokeWidth={selectedUnit?.id === unit.id ? '3' : '2'}
                                    />
                                    {/* Entrance Indication (Door) */}
                                    {unit.y < 100 && <line x1={unit.x + unit.width / 2 - 15} y1={unit.y + unit.height} x2={unit.x + unit.width / 2 + 15} y2={unit.y + unit.height} stroke="white" strokeWidth="4" />}
                                    {unit.y > 400 && <line x1={unit.x + unit.width / 2 - 15} y1={unit.y} x2={unit.x + unit.width / 2 + 15} y2={unit.y} stroke="white" strokeWidth="4" />}

                                    {/* Text Label */}
                                    <text
                                        x={unit.x + unit.width / 2}
                                        y={unit.y + unit.height / 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="12"
                                        fontWeight="600"
                                        fill={selectedUnit?.id === unit.id ? 'white' : '#475569'}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {unit.label}
                                    </text>
                                </g>
                            ))}

                            {/* Amenities Icons */}
                            <g transform="translate(900, 30)">
                                <circle cx="20" cy="20" r="15" fill="#f1f5f9" stroke="#94a3b8" />
                                <text x="20" y="25" textAnchor="middle" fontSize="12">🚹</text>
                            </g>
                            <g transform="translate(900, 80)">
                                <circle cx="20" cy="20" r="15" fill="#f1f5f9" stroke="#94a3b8" />
                                <text x="20" y="25" textAnchor="middle" fontSize="12">⚡</text>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Info Panel (Overlay or Side) */}
                {selectedUnit && (
                    <div className="absolute bottom-8 right-8 w-80 bg-white p-6 rounded-xl shadow-2xl border border-gray-100 animate-slide-up">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">{selectedUnit.type}</span>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedUnit.label}</h2>
                            </div>
                            <button onClick={() => setSelectedUnit(null)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm">
                                Located on <span className="font-semibold text-gray-900">Level {activeFloor}</span>.
                            </p>

                            <button className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
                                Get Directions
                            </button>
                            <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                                View Store Details
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
