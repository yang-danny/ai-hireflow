import type { FastifyInstance } from 'fastify';
import { healthCheck } from '../controllers/health.controller.js';

export default async function healthRoutes(fastify: FastifyInstance) {
   fastify.get('/', {
      schema: {
         description: 'Health check endpoint',
         tags: ['health'],
         response: {
            200: {
               type: 'object',
               properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { type: 'object' },
               },
            },
         },
      },
      handler: healthCheck,
   });
}
