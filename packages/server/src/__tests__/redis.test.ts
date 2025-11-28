import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import redisPlugin from '../plugins/redis.plugin.js';
import { CacheService } from '../services/cache.service.js';
import { envSchema } from '../config/env.js';
import fastifyEnv from '@fastify/env';

describe('Redis & CacheService', () => {
   let fastify: FastifyInstance;
   let cacheService: CacheService;

   beforeAll(async () => {
      fastify = Fastify();

      // Mock env setup
      await fastify.register(fastifyEnv, {
         schema: envSchema,
         data: {
            PORT: 5000,
            MONGODB_URI: process.env.MONGODB_URI,
            JWT_SECRET: 'test-secret',
            GOOGLE_CLIENT_ID: 'test-id',
            GOOGLE_CLIENT_SECRET: 'test-secret',
            REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
         },
      });

      await fastify.register(redisPlugin);
      await fastify.ready();
      cacheService = new CacheService(fastify);
   });

   afterAll(async () => {
      await fastify.close();
   });

   it('should connect to Redis', async () => {
      expect(fastify.redis).toBeDefined();
      const ping = await fastify.redis.ping();
      expect(ping).toBe('PONG');
   });

   it('should set and get values', async () => {
      await cacheService.set('test-key', { foo: 'bar' });
      const value = await cacheService.get<{ foo: string }>('test-key');
      expect(value).toEqual({ foo: 'bar' });
   });

   it('should handle TTL', async () => {
      await cacheService.set('ttl-key', 'value', 1); // 1 second TTL
      const value1 = await cacheService.get('ttl-key');
      expect(value1).toBe('value');

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const value2 = await cacheService.get('ttl-key');
      expect(value2).toBeNull();
   });

   it('should delete values', async () => {
      await cacheService.set('del-key', 'value');
      await cacheService.del('del-key');
      const value = await cacheService.get('del-key');
      expect(value).toBeNull();
   });
});
