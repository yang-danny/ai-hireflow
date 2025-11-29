import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';

async function redisPlugin(fastify: FastifyInstance) {
   try {
      if (process.env.NODE_ENV === 'test') {
         const RedisMock = (await import('ioredis-mock')).default;
         const redis = new RedisMock();
         fastify.decorate('redis', redis as any);
         fastify.log.info('✅ Redis mocked for testing');
      } else {
         // Try to connect to real Redis with a timeout
         const Redis = (await import('ioredis')).default;
         const client = new Redis(fastify.config.REDIS_URL, {
            connectTimeout: 2000,
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => {
               if (times > 3) {
                  return null; // Stop retrying
               }
               return Math.min(times * 50, 2000);
            },
         });

         client.on('error', () => {
            // Suppress unhandled error logs during initial connection attempt
            // fastify.log.warn(`Redis connection warning: ${err.message}`);
         });

         try {
            // Wait for connection or timeout
            await new Promise((resolve, reject) => {
               client.once('ready', resolve);
               client.once('error', reject);
               // Force connection
               if (client.status === 'wait') client.connect().catch(() => {});
            });

            await fastify.register(fastifyRedis, {
               client: client,
               closeClient: true,
            });
            fastify.log.info('✅ Redis connected');
         } catch (err) {
            fastify.log.warn(
               '⚠️ Redis connection failed, using in-memory fallback (production) or exiting'
            );
            client.disconnect();

            // In production, we should not use ioredis-mock (it's a dev dependency)
            // Instead, create a simple in-memory fallback or fail gracefully
            if (process.env.NODE_ENV === 'development') {
               try {
                  const RedisMock = (await import('ioredis-mock')).default;
                  const redis = new RedisMock();
                  fastify.decorate('redis', redis as any);
                  fastify.addHook('onClose', async (instance) => {
                     await instance.redis.quit();
                  });
                  fastify.log.info('✅ Redis mocked (fallback)');
               } catch (mockErr) {
                  fastify.log.error('❌ Failed to load Redis mock:', mockErr);
                  throw new Error('Redis is required but unavailable');
               }
            } else {
               // In production, fail if Redis is not available
               throw new Error('Redis connection is required in production');
            }
         }
      }
   } catch (err: any) {
      fastify.log.error('❌ Redis plugin failed:', err);
      throw err;
   }
}

export default fp(redisPlugin);
