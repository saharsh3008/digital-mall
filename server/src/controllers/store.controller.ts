import { Request, Response, NextFunction } from 'express';
import Store, { IStore } from '../models/Store';
import { AppError } from '../middlewares/error.middleware';
import { catchAsync } from '../utils/catchAsync';

/**
 * @desc    Get all stores
 * @route   GET /api/v1/stores
 * @access  Public
 */
export const getStores = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Basic Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. Advanced Filtering (e.g. ?averageRating[gte]=4)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // 3. Finding
    let query = Store.find(JSON.parse(queryStr));

    // 4. Sorting
    if (req.query.sort) {
        const sortBy = (req.query.sort as string).split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // 5. Field Limiting
    if (req.query.fields) {
        const fields = (req.query.fields as string).split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }

    // Execute
    const stores = await query;

    res.status(200).json({
        success: true,
        count: stores.length,
        data: stores,
    });
});

/**
 * @desc    Get single store
 * @route   GET /api/v1/stores/:id
 * @access  Public
 */
export const getStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
        return next(new AppError(`Store not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: store,
    });
});
