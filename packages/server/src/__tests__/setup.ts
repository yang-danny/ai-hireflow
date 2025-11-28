import { beforeAll, afterAll, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

// Stub only process.exit to prevent it from killing tests
// Keep other process methods intact for Pino logger
const originalExit = process.exit;
process.exit = vi.fn() as any;

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
// MONGODB_URI will be set dynamically by MongoMemoryServer
process.env.JWT_SECRET = 'test-jwt-secret-key-must-be-long-enough';
process.env.COOKIE_SECRET = 'test-cookie-secret-key-must-be-long-enough';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.PORT = '5001';

// Global setup - run once before all tests
beforeAll(async () => {
   // Start in-memory MongoDB instance
   mongod = await MongoMemoryServer.create();
   const uri = mongod.getUri();
   process.env.MONGODB_URI = uri;

   // Ensure clean slate
   if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
   }
}, 60000); // 60 second timeout for potentially downloading binary

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

   // Stop in-memory MongoDB instance
   if (mongod) {
      await mongod.stop();
   }
}, 30000);
