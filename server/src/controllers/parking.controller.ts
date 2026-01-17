import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

interface ParkingZone {
    id: string;
    level: string;
    totalSpots: number;
    occupiedSpots: number;
    type: 'Standard' | 'EV Charging' | 'Disabled';
}

// Simulated IoT Data Store
// In a real app, this would come from sensors/DB
let parkingData: ParkingZone[] = [
    { id: '1', level: 'B1', totalSpots: 150, occupiedSpots: 45, type: 'Standard' },
    { id: '2', level: 'B1-EV', totalSpots: 20, occupiedSpots: 18, type: 'EV Charging' },
    { id: '3', level: 'B2', totalSpots: 200, occupiedSpots: 120, type: 'Standard' },
    { id: '4', level: 'B2-Acc', totalSpots: 15, occupiedSpots: 2, type: 'Disabled' },
];

/**
 * @desc    Get real-time parking status
 * @route   GET /api/v1/parking
 * @access  Public
 */
export const getParkingStatus = catchAsync(async (req: Request, res: Response) => {
    // Simulate slight fluctuation in data on each poll
    const simulatedData = parkingData.map(zone => {
        // Randomly add/remove 1 car
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        let newOccupied = zone.occupiedSpots + change;

        // Bounds check
        if (newOccupied < 0) newOccupied = 0;
        if (newOccupied > zone.totalSpots) newOccupied = zone.totalSpots;

        // Persist simulation for continuity
        zone.occupiedSpots = newOccupied;

        return {
            ...zone,
            availableSpots: zone.totalSpots - newOccupied,
            occupancyRate: Math.round((newOccupied / zone.totalSpots) * 100)
        };
    });

    res.status(200).json({
        success: true,
        updatedAt: new Date(),
        data: simulatedData
    });
});
