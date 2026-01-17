import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        console.log(`Connecting to Mongo URI: ${process.env.MONGO_URI ? 'Defined in ENV' : 'Using Local Fallback'}`);
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/digital-mall');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
