import type { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';
import {
   loginRateLimit,
   registerRateLimit,
} from '../plugins/rateLimit.plugin.js';

export default async function authRoutes(fastify: FastifyInstance) {
   /**
    * Initiates the Google OAuth flow manually.
    * Redirects the user to the Google authorization URL.
    * @route GET /api/auth/google/start
    */
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

   /**
    * Debug route to check OAuth configuration.
    * Returns the current Google OAuth settings (excluding secrets).
    * @route GET /api/auth/google/config
    */
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

   /**
    * Google OAuth callback handler.
    * Exchanges the authorization code for tokens and logs the user in.
    * @route GET /api/auth/google/callback
    */
   fastify.get('/google/callback', {
      handler: AuthController.googleCallback,
   });

   /**
    * Registers a new user with email and password.
    * @route POST /api/auth/register
    * @body {email, password, name}
    */
   fastify.post('/register', {
      ...registerRateLimit,
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

   /**
    * Logs in a user with email and password.
    * @route POST /api/auth/login
    * @body {email, password}
    */
   fastify.post('/login', {
      ...loginRateLimit,
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

   /**
    * Retrieves the currently authenticated user's profile.
    * Requires a valid JWT token.
    * @route GET /api/auth/me
    */
   fastify.get('/me', {
      onRequest: [fastify.authenticate],
      handler: AuthController.me,
   });

   /**
    * Logs out the current user.
    * Clears the authentication cookie.
    * @route POST /api/auth/logout
    */
   fastify.post('/logout', {
      handler: AuthController.logout,
   });
}
