import mongoose, { Schema, Document } from 'mongoose';

export enum AnalyticsEventType {
    STORE_VIEW = 'STORE_VIEW',
    EVENT_VIEW = 'EVENT_VIEW',
    SEARCH_QUERY = 'SEARCH_QUERY',
    OFFER_CLICK = 'OFFER_CLICK',
}

export interface IAnalyticsEvent extends Document {
    eventType: AnalyticsEventType;
    entityId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    metadata?: Record<string, any>;
    timestamp: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
    {
        eventType: {
            type: String,
            enum: Object.values(AnalyticsEventType),
            required: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            required: false, // Not required for Search Queries
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        timestamps: false, // Using custom timestamp field
        versionKey: false,
    }
);

// Primary Time-Series Index
AnalyticsEventSchema.index({ timestamp: -1 });

// Common Access Patterns
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });        // "Get all Store Views in last 7 days"
AnalyticsEventSchema.index({ entityId: 1, eventType: 1 });          // "Get stats for specific Store"
AnalyticsEventSchema.index({ userId: 1, timestamp: -1 });           // "User history"

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
