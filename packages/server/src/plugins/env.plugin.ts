import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { envSchema } from '../config/env.js';

async function envPlugin(fastify: FastifyInstance) {
   await fastify.register(fastifyEnv, {
      schema: envSchema,
      dotenv: true,
   });
}

export default fp(envPlugin);

declare module 'fastify' {
   interface FastifyInstance {
      config: {
         NODE_ENV: string;
         PORT: number;
         HOST: string;
         MONGODB_URI: string;
         JWT_SECRET: string;
         JWT_EXPIRES_IN: string;
         COOKIE_SECRET: string;
         CORS_ORIGIN: string;
         GOOGLE_CLIENT_ID: string;
         GOOGLE_CLIENT_SECRET: string;
         GOOGLE_REDIRECT_URI: string;
         FRONTEND_URL: string;
      };
   }
}
