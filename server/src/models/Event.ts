import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description?: string;
    bannerUrl?: string;
    startDate: Date;
    endDate: Date;
    locationName: string;
    floorLevel?: number;
    tags?: string[];
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true
        },
        description: String,
        bannerUrl: String,
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true, index: true },
        locationName: { type: String, required: true },
        floorLevel: Number,
        tags: [String],
    },
    {
        timestamps: true,
    }
);

// Index to find active events overlapping a date range
EventSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
