import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
    storeId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    code: string;
    qrCodeUrl?: string;
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    redemptionLimit?: number;
    redemptionCount: number;
}

const OfferSchema = new Schema<IOffer>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
            index: true // Fast lookup of offers by store
        },
        title: {
            type: String,
            required: [true, 'Offer title is required']
        },
        description: String,
        code: {
            type: String,
            required: true,
            uppercase: true
        },
        qrCodeUrl: String,
        validFrom: { type: Date, default: Date.now },
        validUntil: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        redemptionLimit: Number,
        redemptionCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// TTL Index - expire document 0 seconds after validUntil
// The background job runs every 60s by default in Mongo
OfferSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOffer>('Offer', OfferSchema);
