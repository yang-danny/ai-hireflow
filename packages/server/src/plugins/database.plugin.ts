import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';

async function databasePlugin(fastify: FastifyInstance) {
   const mongoUri = fastify.config.MONGODB_URI;

   await connectDB(mongoUri);

   fastify.addHook('onClose', async () => {
      await mongoose.disconnect();
   });
}

export default fp(databasePlugin);
