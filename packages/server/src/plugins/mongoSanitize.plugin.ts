import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import sanitize from 'mongo-sanitize';

/**
 * Plugin to sanitize request data against NoSQL injection
 */
async function mongoSanitizePlugin(fastify: FastifyInstance) {
   fastify.addHook('preValidation', async (request) => {
      if (request.body) {
         request.body = sanitize(request.body);
      }
      if (request.query) {
         request.query = sanitize(request.query);
      }
      if (request.params) {
         request.params = sanitize(request.params);
      }
   });

   fastify.log.info('✅ Mongo Sanitize plugin registered');
}

export default fp(mongoSanitizePlugin);
