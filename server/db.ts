
import mongoose from 'mongoose';
import { env } from './config';

export async function connectToMongoDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export const disconnectFromMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
