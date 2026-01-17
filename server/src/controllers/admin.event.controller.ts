import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import { AppError } from '../middlewares/error.middleware';
import { catchAsync } from '../utils/catchAsync';

export const createEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.create(req.body);

    res.status(201).json({
        success: true,
        data: event,
    });
});

export const updateEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!event) {
        return next(new AppError(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: event,
    });
});

export const deleteEvent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
        return next(new AppError(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {},
    });
});
