import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    role: 'shopper' | 'tenant_manager' | 'admin';
    profile: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        avatarUrl?: string;
        // Shopper specific
        preferences?: string[];
        savedStoreIds?: mongoose.Types.ObjectId[];
        // Tenant specific
        managedStoreId?: mongoose.Types.ObjectId;
    };
    authProvider: string;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: false, // Optional for social login users
            select: false,   // Don't return password by default
        },
        role: {
            type: String,
            enum: ['shopper', 'tenant_manager', 'admin'],
            default: 'shopper',
            required: true,
        },
        profile: {
            firstName: String,
            lastName: String,
            phone: String,
            avatarUrl: String,
            preferences: [String],
            savedStoreIds: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
            managedStoreId: { type: Schema.Types.ObjectId, ref: 'Store' },
        },
        authProvider: {
            type: String,
            enum: ['email', 'google', 'apple'],
            default: 'email',
        },
        lastActiveAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>('User', UserSchema);
