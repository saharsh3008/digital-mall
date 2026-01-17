import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
    tenantId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    category: string;
    description?: string;
    logoUrl?: string;
    heroImageUrl?: string;
    location: {
        type: 'Point';
        coordinates: number[]; // [lng, lat]
        floorLevel: number;
        unitNumber?: string;
    };
    isOpen: boolean;
    operatingHours: {
        [key: string]: { open: string; close: string; isClosed?: boolean };
    };
    averageRating: number;
    activeOfferCount: number;
}

const StoreSchema = new Schema<IStore>(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: {
            type: String,
            required: [true, 'Store name is required'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters']
        },
        slug: { type: String, unique: true, index: true },
        category: {
            type: String,
            required: [true, 'Category is required'],
            index: true
        },
        description: { type: String, maxlength: 1000 },
        logoUrl: String,
        heroImageUrl: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
                index: '2dsphere',
            },
            floorLevel: { type: Number, required: true, index: true },
            unitNumber: String,
        },
        isOpen: { type: Boolean, default: true },
        operatingHours: {
            mon: { open: String, close: String, isClosed: Boolean },
            tue: { open: String, close: String, isClosed: Boolean },
            wed: { open: String, close: String, isClosed: Boolean },
            thu: { open: String, close: String, isClosed: Boolean },
            fri: { open: String, close: String, isClosed: Boolean },
            sat: { open: String, close: String, isClosed: Boolean },
            sun: { open: String, close: String, isClosed: Boolean },
        },
        averageRating: { type: Number, default: 0 },
        activeOfferCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Unique slug generator or pre-save hook could go here
StoreSchema.index({ name: 'text', description: 'text' });
// Compound index for efficient directory filtering
StoreSchema.index({ category: 1, 'location.floorLevel': 1 });

export default mongoose.model<IStore>('Store', StoreSchema);
