import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

async function rateLimitPlugin(fastify: FastifyInstance) {
   // Register global rate limit - 100 requests per minute
   await fastify.register(rateLimit, {
      global: true,
      max: 100,
      timeWindow: '1 minute',
      redis: fastify.redis, // Use the Redis instance from fastify-redis
      allowList: ['127.0.0.1'],
      skipOnError: false,
      ban: 3, // Ban after 3 violations
      continueExceeding: false,
      enableDraftSpec: true,
      addHeadersOnExceeding: {
         'x-ratelimit-limit': true,
         'x-ratelimit-remaining': true,
         'x-ratelimit-reset': true,
      },
      addHeaders: {
         'x-ratelimit-limit': true,
         'x-ratelimit-remaining': true,
         'x-ratelimit-reset': true,
         'retry-after': true,
      },
   });

   fastify.log.info('✅ Rate limiting configured: Global 100/min');
}

export default fp(rateLimitPlugin);

// Export rate limit configurations for use in route definitions
export const loginRateLimit = {
   config: {
      rateLimit: {
         max: 5,
         timeWindow: '15 minutes',
      },
   },
};

export const registerRateLimit = {
   config: {
      rateLimit: {
         max: 3,
         timeWindow: '1 hour',
      },
   },
};
