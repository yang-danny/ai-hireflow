import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function corsPlugin(fastify: FastifyInstance) {
   const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
   ];

   // Add CORS headers to every request
   fastify.addHook('onRequest', async (request, reply) => {
      const origin = request.headers.origin;

      // Set CORS headers
      if (origin && allowedOrigins.includes(origin)) {
         reply.header('Access-Control-Allow-Origin', origin);
      } else {
         // In development, allow any origin
         reply.header('Access-Control-Allow-Origin', origin || '*');
      }

      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header(
         'Access-Control-Allow-Methods',
         'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      );
      reply.header(
         'Access-Control-Allow-Headers',
         'Content-Type, Authorization, Cookie, X-Requested-With, Accept'
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

      if (!reply.hasHeader('Access-Control-Allow-Origin')) {
         if (origin && allowedOrigins.includes(origin)) {
            reply.header('Access-Control-Allow-Origin', origin);
         } else {
            reply.header('Access-Control-Allow-Origin', origin || '*');
         }
         reply.header('Access-Control-Allow-Credentials', 'true');
      }

      return payload;
   });

   fastify.log.info('✅ Manual CORS configured');
}

export default fp(corsPlugin);
