import mongoose from 'mongoose';

export const connectDB = async (uri: string): Promise<void> => {
   try {
      await mongoose.connect(uri);

      console.log('✅ MongoDB Connected Successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);

      // Connection events
      mongoose.connection.on('error', (err) => {
         console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
         console.log('👋 MongoDB disconnected');
      });

      process.on('SIGINT', async () => {
         await mongoose.connection.close();
         process.exit(0);
      });
   } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
      process.exit(1);
   }
};

export const disconnectDB = async (): Promise<void> => {
   try {
      await mongoose.disconnect();
      console.log('👋 MongoDB Disconnected');
   } catch (error) {
      console.error('❌ MongoDB Disconnection Error:', error);
   }
};
