import { Request, Response, NextFunction } from 'express';
import Store from '../models/Store';
import { AppError } from '../middlewares/error.middleware';
import { catchAsync } from '../utils/catchAsync';

/**
 * @desc    Get all stores (Admin View - maybe more details?)
 * @route   GET /api/v1/admin/stores
 * @access  Private (Admin)
 */
export const getAdminStores = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stores = await Store.find()
        .populate('tenantId', 'email profile.firstName profile.lastName')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: stores.length,
        data: stores,
    });
});

/**
 * @desc    Create new store
 * @route   POST /api/v1/admin/stores
 * @access  Private (Admin)
 */
export const createStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.create(req.body);

    res.status(201).json({
        success: true,
        data: store,
    });
});

/**
 * @desc    Update store
 * @route   PUT /api/v1/admin/stores/:id
 * @access  Private (Admin)
 */
export const updateStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!store) {
        return next(new AppError(`Store not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: store,
    });
});

/**
 * @desc    Delete store
 * @route   DELETE /api/v1/admin/stores/:id
 * @access  Private (Admin)
 */
export const deleteStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.findByIdAndDelete(req.params.id);

    if (!store) {
        return next(new AppError(`Store not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {},
    });
});
