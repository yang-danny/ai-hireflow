import type { FastifyInstance } from 'fastify';
import fastifyCaching from '@fastify/caching';
import fp from 'fastify-plugin';

async function cachingPlugin(fastify: FastifyInstance) {
   await fastify.register(fastifyCaching, {
      privacy: 'private', // Default privacy setting
      expiresIn: 300, // Default expiration: 5 minutes (in seconds)

      // Server-side caching using memory (for development)
      // In production, you'd want to use Redis
      serverExpiresIn: 300, // Cache responses on server for 5 minutes
   });

   // Add cache control helpers to fastify instance
   fastify.decorate('cacheControl', {
      /**
       * No caching - always fetch fresh
       */
      noCache: () => ({
         'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
         Pragma: 'no-cache',
         Expires: '0',
      }),

      /**
       * Short-term caching (1 minute)
       */
      short: () => ({
         'Cache-Control': 'public, max-age=60',
      }),

      /**
       * Medium-term caching (5 minutes)
       */
      medium: () => ({
         'Cache-Control': 'public, max-age=300',
      }),

      /**
       * Long-term caching (1 hour)
       */
      long: () => ({
         'Cache-Control': 'public, max-age=3600',
      }),

      /**
       * Immutable caching (1 year - for versioned assets)
       */
      immutable: () => ({
         'Cache-Control': 'public, max-age=31536000, immutable',
      }),

      /**
       * Conditional caching with revalidation
       */
      revalidate: (maxAge: number = 300) => ({
         'Cache-Control': `public, max-age=${maxAge}, must-revalidate`,
      }),

      /**
       * Private caching (user-specific, not shared)
       */
      private: (maxAge: number = 300) => ({
         'Cache-Control': `private, max-age=${maxAge}`,
      }),

      /**
       * Stale-while-revalidate pattern
       */
      staleWhileRevalidate: (
         maxAge: number = 300,
         staleTime: number = 600
      ) => ({
         'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${staleTime}`,
      }),
   });

   fastify.log.info('✅ Caching plugin configured');
}

export default fp(cachingPlugin);

// TypeScript declaration for cache control helpers
declare module 'fastify' {
   interface FastifyInstance {
      cacheControl: {
         noCache: () => Record<string, string>;
         short: () => Record<string, string>;
         medium: () => Record<string, string>;
         long: () => Record<string, string>;
         immutable: () => Record<string, string>;
         revalidate: (maxAge?: number) => Record<string, string>;
         private: (maxAge?: number) => Record<string, string>;
         staleWhileRevalidate: (
            maxAge?: number,
            staleTime?: number
         ) => Record<string, string>;
      };
   }
}
