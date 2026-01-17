import { Request, Response, NextFunction } from 'express';
import AnalyticsEvent, { AnalyticsEventType } from '../models/AnalyticsEvent';
import { catchAsync } from '../utils/catchAsync';

const getDateFilter = (days: string | number = 30) => {
    const d = new Date();
    d.setDate(d.getDate() - Number(days));
    return d;
};

export const getTopStores = catchAsync(async (req: Request, res: Response) => {
    const days = req.query.days || 30;
    const startDate = getDateFilter(days as string);

    const stats = await AnalyticsEvent.aggregate([
        {
            $match: {
                eventType: AnalyticsEventType.STORE_VIEW,
                timestamp: { $gte: startDate }
            }
        },
        { $group: { _id: '$entityId', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        // Join with Store collection to get names
        {
            $lookup: {
                from: 'stores',
                localField: '_id',
                foreignField: '_id',
                as: 'store'
            }
        },
        { $unwind: '$store' },
        {
            $project: {
                storeId: '$_id',
                name: '$store.name',
                category: '$store.category',
                views: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: stats
    });
});

export const getTopSearches = catchAsync(async (req: Request, res: Response) => {
    const days = req.query.days || 30;
    const startDate = getDateFilter(days as string);

    const stats = await AnalyticsEvent.aggregate([
        {
            $match: {
                eventType: AnalyticsEventType.SEARCH_QUERY,
                timestamp: { $gte: startDate }
            }
        },
        // Normalize lowercase
        {
            $group: {
                _id: { $toLower: '$metadata.query' },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    res.status(200).json({
        success: true,
        data: stats.map(s => ({ query: s._id, count: s.count }))
    });
});

export const getActivityOverTime = catchAsync(async (req: Request, res: Response) => {
    const days = req.query.days || 30;
    const startDate = getDateFilter(days as string);

    const stats = await AnalyticsEvent.aggregate([
        {
            $match: {
                timestamp: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                },
                totalEvents: { $sum: 1 },
                storeViews: {
                    $sum: {
                        $cond: [{ $eq: ["$eventType", AnalyticsEventType.STORE_VIEW] }, 1, 0]
                    }
                },
                searches: {
                    $sum: {
                        $cond: [{ $eq: ["$eventType", AnalyticsEventType.SEARCH_QUERY] }, 1, 0]
                    }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        success: true,
        data: stats
    });
});
