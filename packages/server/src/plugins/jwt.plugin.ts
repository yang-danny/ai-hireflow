import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';

async function jwtPlugin(fastify: FastifyInstance) {
   // Register cookie plugin first
   await fastify.register(cookie, {
      secret: fastify.config.COOKIE_SECRET,
   });

   // Register JWT plugin
   await fastify.register(jwt, {
      secret: fastify.config.JWT_SECRET,
      sign: {
         expiresIn: fastify.config.JWT_EXPIRES_IN,
      },
      cookie: {
         cookieName: 'token',
         signed: false,
      },
   });

   // Add authentication decorator
   fastify.decorate('authenticate', async function (request, reply) {
      try {
         await request.jwtVerify();
      } catch (err) {
         reply.status(401).send({
            success: false,
            message: 'Unauthorized - Invalid or expired token',
         });
      }
   });
}

export default fp(jwtPlugin);

// Type declarations
declare module 'fastify' {
   interface FastifyInstance {
      authenticate: (request: any, reply: any) => Promise<void>;
   }
}

declare module '@fastify/jwt' {
   interface FastifyJWT {
      payload: {
         id: string;
         email: string;
         role: string;
      };
      user: {
         id: string;
         email: string;
         role: string;
      };
   }
}
