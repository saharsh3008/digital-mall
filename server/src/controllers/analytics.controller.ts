import { Request, Response, NextFunction } from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent';
import { AppError } from '../middlewares/error.middleware';
import { catchAsync } from '../utils/catchAsync';

/**
 * @desc    Record an analytics event
 * @route   POST /api/v1/analytics/event
 * @access  Public (Can be protected if needed, but usually public for clickstream)
 */
export const recordEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { eventType, entityId, metadata } = req.body;

    if (!eventType) {
        return next(new AppError('EventType is required', 400));
    }

    // 1. Fire-and-forget: Start saving but don't await
    // We attach a trivial catch to prevent unhandled rejection crashes
    AnalyticsEvent.create({
        eventType,
        entityId,
        metadata,
        // Optional: Extract user from token if available
        userId: (req as any).user?.id
    }).catch(err => console.error('Analytics Write Error:', err));

    // 2. Respond immediately
    res.status(202).json({
        success: true,
        data: null // Empty response to save bandwidth
    });
});
