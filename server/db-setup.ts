
import { connectToMongoDB, disconnectFromMongoDB } from './db';
import { User, Session } from '../shared/models';

async function setupDatabase() {
  console.log('Setting up MongoDB database...');
  
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Create indexes for better performance
    await User.createIndexes();
    await Session.createIndexes();
    
    console.log('MongoDB database setup completed successfully');
  } catch (error) {
    console.error('MongoDB database setup failed:', error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await disconnectFromMongoDB();
  }
}

// Execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };
