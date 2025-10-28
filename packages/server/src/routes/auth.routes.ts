import type { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';

export default async function authRoutes(fastify: FastifyInstance) {
   // Manual Google OAuth start (if plugin route doesn't work)
   fastify.get('/google/start', {
      handler: async (request, reply) => {
         try {
            const authUrl = await fastify.googleOAuth2.generateAuthorizationUri(
               request,
               reply
            );
            return reply.redirect(authUrl);
         } catch (error: any) {
            fastify.log.error('OAuth start error:', error);
            return reply.status(500).send({
               success: false,
               message: error.message,
            });
         }
      },
   });

   // Debug route - check OAuth configuration
   fastify.get('/google/config', {
      handler: async (request, reply) => {
         return {
            success: true,
            config: {
               clientId:
                  fastify.config.GOOGLE_CLIENT_ID?.substring(0, 30) + '...',
               redirectUri: fastify.config.GOOGLE_REDIRECT_URI,
               startPath: '/api/auth/google',
               manualStartPath: '/api/auth/google/start',
               callbackPath: '/api/auth/google/callback',
            },
         };
      },
   });

   // Google OAuth - Callback
   fastify.get('/google/callback', {
      handler: AuthController.googleCallback,
   });

   // Register with email/password
   fastify.post('/register', {
      schema: {
         body: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
               email: { type: 'string', format: 'email' },
               password: { type: 'string', minLength: 6 },
               name: { type: 'string', minLength: 2 },
            },
         },
      },
      handler: AuthController.register,
   });

   // Login with email/password
   fastify.post('/login', {
      schema: {
         body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
               email: { type: 'string', format: 'email' },
               password: { type: 'string' },
            },
         },
      },
      handler: AuthController.login,
   });

   // Get current user (protected)
   fastify.get('/me', {
      onRequest: [fastify.authenticate],
      handler: AuthController.me,
   });

   // Logout
   fastify.post('/logout', {
      handler: AuthController.logout,
   });
}
