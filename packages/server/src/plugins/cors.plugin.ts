import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function corsPlugin(fastify: FastifyInstance) {
   // Get allowed origins from environment variable or use defaults
   const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
   const defaultOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
   ];

   const allowedOrigins = allowedOriginsEnv
      ? allowedOriginsEnv.split(',').map((origin) => origin.trim())
      : defaultOrigins;

   // Validate origin function
   const isAllowedOrigin = (origin: string | undefined): boolean => {
      if (!origin) return false;

      // In production, strictly check against whitelist
      if (process.env.NODE_ENV === 'production') {
         return allowedOrigins.includes(origin);
      }

      // In development, allow localhost variations but not completely open
      return (
         allowedOrigins.includes(origin) ||
         origin.startsWith('http://localhost:') ||
         origin.startsWith('http://127.0.0.1:')
      );
   };

   // Add CORS headers to every request
   fastify.addHook('onRequest', async (request, reply) => {
      const origin = request.headers.origin;

      // Validate and set CORS headers
      if (origin && isAllowedOrigin(origin)) {
         reply.header('Access-Control-Allow-Origin', origin);
         reply.header('Access-Control-Allow-Credentials', 'true');
      } else if (origin) {
         // Log rejected origins for security monitoring
         fastify.log.warn(`Rejected CORS request from origin: ${origin}`);
      }

      reply.header(
         'Access-Control-Allow-Methods',
         'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      );
      reply.header(
         'Access-Control-Allow-Headers',
         'Content-Type, Authorization, Cookie, X-Requested-With, Accept, X-CSRF-Token'
      );
      reply.header('Access-Control-Expose-Headers', 'set-cookie');
      reply.header('Vary', 'Origin');

      // Handle preflight requests
      if (request.method === 'OPTIONS') {
         reply.code(204);
         return reply.send();
      }
   });

   // Also add to onSend hook to ensure headers are on response
   fastify.addHook('onSend', async (request, reply, payload) => {
      const origin = request.headers.origin;

      if (
         !reply.hasHeader('Access-Control-Allow-Origin') &&
         origin &&
         isAllowedOrigin(origin)
      ) {
         reply.header('Access-Control-Allow-Origin', origin);
         reply.header('Access-Control-Allow-Credentials', 'true');
      }

      return payload;
   });

   fastify.log.info(
      `✅ CORS configured with ${allowedOrigins.length} allowed origins`
   );
   fastify.log.info(`   Allowed origins: ${allowedOrigins.join(', ')}`);
}

export default fp(corsPlugin);
