import Fastify, { FastifyInstance } from 'fastify';
import { errorHandler } from './utils/errorHandler.js';

// Plugins
import envPlugin from './plugins/env.plugin.js';
import corsPlugin from './plugins/cors.plugin.js';
import helmetPlugin from './plugins/helmet.plugin.js';
import databasePlugin from './plugins/database.plugin.js';
import jwtPlugin from './plugins/jwt.plugin.js';
import oauthPlugin from './plugins/oauth.plugin.js';
import rateLimitPlugin from './plugins/rateLimit.plugin.js';
import csrfPlugin from './plugins/csrf.plugin.js';

// Routes
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import jobRoutes from './routes/job.routes.js';

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

   // Register plugins in order
   await fastify.register(envPlugin);
   await fastify.register(corsPlugin); // CORS must be early
   await fastify.register(helmetPlugin); // Security headers
   await fastify.register(rateLimitPlugin); // Rate limiting
   await fastify.register(databasePlugin);
   await fastify.register(jwtPlugin);
   await fastify.register(csrfPlugin); // CSRF protection (after cookie/jwt)
   await fastify.register(oauthPlugin);
   // Root route
   fastify.get('/', async (request, reply) => {
      return {
         success: true,
         message: 'Welcome to AI-HireFlow API',
         version: '1.0.0',
         module: 'ESM',
         cors: 'enabled',
         endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            users: '/api/users',
            resumes: '/api/resumes',
            jobs: '/api/jobs',
         },
      };
   });

   // Register routes
   await fastify.register(healthRoutes, { prefix: '/api/health' });
   await fastify.register(authRoutes, { prefix: '/api/auth' });
   await fastify.register(userRoutes, { prefix: '/api/users' });
   await fastify.register(resumeRoutes, { prefix: '/api/resumes' });
   await fastify.register(jobRoutes, { prefix: '/api/jobs' });

   return fastify;
}
