import type { FastifyInstance } from 'fastify';
import {
   healthCheck,
   readinessCheck,
   livenessCheck,
} from '../controllers/health.controller.js';

export default async function healthRoutes(fastify: FastifyInstance) {
   // GET /api/health - Basic health check
   fastify.get('/', {
      schema: {
         tags: ['Health'],
         summary: 'Health check',
         description: 'Check if the API is running and responsive',
      },
      async handler(request, reply) {
         // Cache for 1 minute
         reply.headers(fastify.cacheControl.short());
         return healthCheck(request, reply);
      },
   });

   // GET /api/health/ready - Readiness check
   fastify.get('/ready', {
      schema: {
         tags: ['Health'],
         summary: 'Readiness check',
         description:
            'Check if the API is ready to handle requests (database and Redis connected)',
      },
      async handler(request, reply) {
         // No cache for readiness probes (load balancers need real-time status)
         reply.headers(fastify.cacheControl.noCache());
         return readinessCheck(request, reply);
      },
   });

   // GET /api/health/live - Liveness check
   fastify.get('/live', {
      schema: {
         tags: ['Health'],
         summary: 'Liveness check',
         description: 'Check if the API process is alive and not deadlocked',
      },
      async handler(request, reply) {
         // No cache for liveness probes (orchestrators need real-time status)
         reply.headers(fastify.cacheControl.noCache());
         return livenessCheck(request, reply);
      },
   });
}
