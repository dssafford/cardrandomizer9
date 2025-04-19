import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/card-memorizer';

async function checkConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    
    // Test the connection by listing collections
    if (conn.connection.db) {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map((c: { name: string }) => c.name));
    } else {
      console.log('No database connection available');
    }
    
    await mongoose.disconnect();
    console.log('Successfully disconnected from MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

checkConnection(); 