import { Request, Response, NextFunction } from 'express';
import Offer from '../models/Offer';
import { catchAsync } from '../utils/catchAsync';

/**
 * @desc    Get all active offers
 * @route   GET /api/v1/offers
 * @access  Public
 */
export const getActiveOffers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const offers = await Offer.find({
        isActive: true,
        validUntil: { $gt: new Date() }
    })
        .populate('storeId', 'name heroImageUrl category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Offer.countDocuments({
        isActive: true,
        validUntil: { $gt: new Date() }
    });

    res.status(200).json({
        success: true,
        count: offers.length,
        pagination: { page, limit, total },
        data: offers.map(offer => ({
            _id: offer._id,
            title: offer.title,
            description: offer.description,
            code: offer.code,
            validUntil: offer.validUntil,
            store: offer.storeId // Populated
        }))
    });
});
