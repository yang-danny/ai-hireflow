import Fastify, { FastifyInstance } from 'fastify';
import { errorHandler } from './utils/errorHandler.js';

// Plugins
import envPlugin from './plugins/env.plugin.js';
import corsPlugin from './plugins/cors.plugin.js';
// import helmetPlugin from './plugins/helmet.plugin.js'; // COMMENT THIS OUT
import databasePlugin from './plugins/database.plugin.js';
import jwtPlugin from './plugins/jwt.plugin.js';
import oauthPlugin from './plugins/oauth.plugin.js';

// Routes
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
   const fastify = Fastify({
      logger: {
         transport:
            process.env.NODE_ENV === 'development'
               ? {
                    target: 'pino-pretty',
                    options: {
                       translateTime: 'HH:MM:ss Z',
                       ignore: 'pid,hostname',
                    },
                 }
               : undefined,
      },
      ajv: {
         customOptions: {
            removeAdditional: 'all',
            coerceTypes: true,
            useDefaults: true,
         },
      },
   });

   // Set error handler
   fastify.setErrorHandler(errorHandler);

   // Register plugins - CORS FIRST!
   await fastify.register(envPlugin);
   await fastify.register(corsPlugin); // Must be early
   // await fastify.register(helmetPlugin); // DISABLED for now
   await fastify.register(databasePlugin);
   await fastify.register(jwtPlugin);
   await fastify.register(oauthPlugin);

   // Root route
   fastify.get('/', async (request, reply) => {
      return {
         success: true,
         message: 'Welcome to AI-HireFlow API',
         version: '1.0.0',
         module: 'ESM',
         cors: 'enabled',
      };
   });

   // CORS test endpoint
   fastify.get('/test-cors', async (request, reply) => {
      return {
         success: true,
         message: 'CORS is working!',
         origin: request.headers.origin,
      };
   });

   // Register routes
   await fastify.register(healthRoutes, { prefix: '/api/health' });
   await fastify.register(authRoutes, { prefix: '/api/auth' });
   await fastify.register(userRoutes, { prefix: '/api/users' });

   return fastify;
}
