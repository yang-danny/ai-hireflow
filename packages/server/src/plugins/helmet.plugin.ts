import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export default async function helmetPlugin(fastify: FastifyInstance) {
   // Only register helmet in production or disable problematic features
   if (process.env.NODE_ENV === 'production') {
      await fastify.register(helmet, {
         contentSecurityPolicy: false,
         crossOriginEmbedderPolicy: false,
         crossOriginOpenerPolicy: false,
         crossOriginResourcePolicy: false,
      });
      fastify.log.info('✅ Helmet plugin registered (production mode)');
   } else {
      // In development, use minimal helmet or skip it
      fastify.log.info('⚠️  Helmet disabled in development mode');
   }
}
