import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import oauth2, { OAuth2Namespace } from '@fastify/oauth2';

async function oauthPlugin(fastify: FastifyInstance) {
   try {
      fastify.log.info('Configuring Google OAuth2...');
      fastify.log.info(
         `Client ID: ${fastify.config.GOOGLE_CLIENT_ID?.substring(0, 20)}...`
      );
      fastify.log.info(`Redirect URI: ${fastify.config.GOOGLE_REDIRECT_URI}`);

      await fastify.register(oauth2, {
         name: 'googleOAuth2',
         scope: ['profile', 'email'],
         credentials: {
            client: {
               id: fastify.config.GOOGLE_CLIENT_ID,
               secret: fastify.config.GOOGLE_CLIENT_SECRET,
            },
            auth: oauth2.GOOGLE_CONFIGURATION,
         },
         startRedirectPath: '/api/auth/google',
         callbackUri: fastify.config.GOOGLE_REDIRECT_URI,
         callbackUriParams: {
            // Add any additional params if needed
         },
         pkce: 'S256', // Enable PKCE for better security
      });

      fastify.log.info('✅ Google OAuth2 configured successfully');
   } catch (error) {
      fastify.log.error('❌ Failed to configure Google OAuth2:', error);
      throw error;
   }
}

export default fp(oauthPlugin);

// Type declaration for OAuth2
declare module 'fastify' {
   interface FastifyInstance {
      googleOAuth2: OAuth2Namespace;
   }
}
