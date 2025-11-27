import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';

async function csrfPlugin(fastify: FastifyInstance) {
   await fastify.register(csrf, {
      sessionPlugin: '@fastify/cookie',
      cookieOpts: {
         signed: true,
         sameSite: 'strict',
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
      },
   });

   fastify.log.info('✅ CSRF protection configured');
}

export default fp(csrfPlugin);
