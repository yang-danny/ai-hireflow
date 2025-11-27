import { beforeAll, afterAll, vi } from 'vitest';
import mongoose from 'mongoose';

// Stub only process.exit to prevent it from killing tests
// Keep other process methods intact for Pino logger
const originalExit = process.exit;
process.exit = vi.fn() as any;

// Global setup - run once before all tests
beforeAll(async () => {
   // Ensure clean slate
   if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
   }
}, 30000); // 30 second timeout

// Global teardown - run once after all tests
afterAll(async () => {
   // Restore original process.exit
   process.exit = originalExit;

   // Clean up database connections
   if (mongoose.connection.readyState !== 0) {
      const collections = Object.keys(mongoose.connection.collections);
      for (const collectionName of collections) {
         const collection = mongoose.connection.collections[collectionName];
         await collection.deleteMany({});
      }
      await mongoose.connection.close();
   }
}, 30000);
