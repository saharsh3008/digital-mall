import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import { AppError } from '../middlewares/error.middleware';
import { catchAsync } from '../utils/catchAsync';

/**
 * @desc    Get all active events
 * @route   GET /api/v1/events
 * @access  Public
 */
export const getEvents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();

    // Return events that haven't ended yet
    const events = await Event.find({
        endDate: { $gte: today }
    }).sort('startDate');

    res.status(200).json({
        success: true,
        count: events.length,
        data: events,
    });
});

/**
 * @desc    Get single event
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
export const getEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new AppError(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: event,
    });
});
