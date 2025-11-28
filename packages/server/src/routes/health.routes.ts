import type { FastifyInstance } from 'fastify';
import {
   healthCheck,
   readinessCheck,
   livenessCheck,
} from '../controllers/health.controller.js';

export default async function healthRoutes(fastify: FastifyInstance) {
   // Main health check - comprehensive
   fastify.get('/', {
      schema: {
         description:
            'Comprehensive health check with database and memory status',
         tags: ['health'],
      } as any,
      handler: healthCheck,
   });

   // Readiness check - is service ready to receive traffic?
   fastify.get('/ready', {
      schema: {
         description: 'Readiness probe for load balancers',
         tags: ['health'],
      } as any,
      handler: readinessCheck,
   });

   // Liveness check - is service alive?
   fastify.get('/live', {
      schema: {
         description: 'Liveness probe for container orchestration',
         tags: ['health'],
      } as any,
      handler: livenessCheck,
   });
}
