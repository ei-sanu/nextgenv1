import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGO_DB_NAME || (process.env.NODE_ENV === 'production' ? 'secure_scanner_prod' : 'secure_scanner_dev');
    const conn = await mongoose.connect(mongoURI, { dbName });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${dbName}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[MongoDB] Connection Error: ${message}`);
    process.exit(1);
  }
};
