import Fastify, { type FastifyInstance } from 'fastify';
import {
   serializerCompiler,
   validatorCompiler,
   type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { errorHandler } from './utils/errorHandler.js';

// Plugins
import envPlugin from './plugins/env.plugin.js';
import corsPlugin from './plugins/cors.plugin.js';
import helmetPlugin from './plugins/helmet.plugin.js';
import swaggerPlugin from './plugins/swagger.plugin.js';
import cachingPlugin from './plugins/caching.plugin.js';
import etagPlugin from './plugins/etag.plugin.js';
import databasePlugin from './plugins/database.plugin.js';
import jwtPlugin from './plugins/jwt.plugin.js';
import oauthPlugin from './plugins/oauth.plugin.js';
import rateLimitPlugin from './plugins/rateLimit.plugin.js';
import redisPlugin from './plugins/redis.plugin.js';
import csrfPlugin from './plugins/csrf.plugin.js';
import mongoSanitizePlugin from './plugins/mongoSanitize.plugin.js';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import jobRoutes from './routes/job.routes.js';

// ... imports

export async function buildApp(): Promise<FastifyInstance> {
   const fastify = Fastify({
      logger: {
         level: process.env.NODE_ENV === 'production' ? 'info' : 'info',
         transport:
            process.env.NODE_ENV !== 'production'
               ? {
                    target: 'pino-pretty',
                    options: {
                       colorize: true,
                       translateTime: 'HH:MM:ss Z',
                       ignore: 'pid,hostname',
                    },
                 }
               : undefined,
      },
      disableRequestLogging: process.env.NODE_ENV === 'test',
   });

   // Set validator and serializer
   fastify.withTypeProvider<ZodTypeProvider>();

   fastify.setValidatorCompiler(validatorCompiler);
   fastify.setSerializerCompiler(serializerCompiler);

   // Set error handler
   fastify.setErrorHandler(errorHandler);

   // Register plugins in order
   await fastify.register(envPlugin);
   await fastify.register(corsPlugin); // CORS must be early
   await fastify.register(helmetPlugin); // Security headers
   await fastify.register(swaggerPlugin); // API documentation
   await fastify.register(cachingPlugin); // HTTP caching
   await fastify.register(etagPlugin); // ETag support
   await fastify.register(mongoSanitizePlugin); // NoSQL Injection protection
   await fastify.register(multipart); // File uploads

   // Static file serving for avatars
   await fastify.register(fastifyStatic, {
      root: path.join(__dirname, '../uploads'),
      prefix: '/uploads/',
   });

   await fastify.register(redisPlugin);
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
            docs: '/api/docs',
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
