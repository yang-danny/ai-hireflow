import type { FastifyInstance } from 'fastify';

export class CacheService {
   private redis: FastifyInstance['redis'];

   constructor(fastify: FastifyInstance) {
      this.redis = fastify.redis;
   }

   /**
    * Get a value from the cache
    * @param key Cache key
    */
   async get<T>(key: string): Promise<T | null> {
      const data = await this.redis.get(key);
      if (!data) return null;
      try {
         return JSON.parse(data) as T;
      } catch {
         return data as unknown as T;
      }
   }

   /**
    * Set a value in the cache
    * @param key Cache key
    * @param value Value to store
    * @param ttl Time to live in seconds (optional)
    */
   async set(key: string, value: any, ttl?: number): Promise<void> {
      const stringValue =
         typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) {
         await this.redis.set(key, stringValue, 'EX', ttl);
      } else {
         await this.redis.set(key, stringValue);
      }
   }

   /**
    * Delete a value from the cache
    * @param key Cache key
    */
   async del(key: string): Promise<void> {
      await this.redis.del(key);
   }

   /**
    * Clear all keys matching a pattern
    * @param pattern Key pattern (e.g., "user:*")
    */
   async clearPattern(pattern: string): Promise<void> {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
         await this.redis.del(...keys);
      }
   }
}
