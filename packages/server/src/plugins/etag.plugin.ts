import type { FastifyInstance } from 'fastify';
import fastifyEtag from '@fastify/etag';
import fp from 'fastify-plugin';

async function etagPlugin(fastify: FastifyInstance) {
   await fastify.register(fastifyEtag, {
      algorithm: 'fnv1a', // Fast hash algorithm (faster than MD5/SHA)
      weak: false, // Use strong ETags by default
   });

   fastify.log.info('✅ ETag support enabled');
}

export default fp(etagPlugin);
