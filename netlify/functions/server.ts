import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { buildApp } from '../../packages/server/src/app.js';
import { ImageService } from '../../packages/server/src/services/image.service.js';
import type { FastifyInstance } from 'fastify';

let cachedApp: FastifyInstance | null = null;

async function getApp(): Promise<FastifyInstance> {
   if (!cachedApp) {
      console.log('Initializing Fastify app for Netlify Functions...');
      try {
         // Initialize image service
         await ImageService.init();

         // Build the Fastify app
         cachedApp = await buildApp();
         await cachedApp.ready();

         console.log('Fastify app initialized successfully');
      } catch (error) {
         console.error('Failed to initialize Fastify app:', error);
         throw error;
      }
   }
   return cachedApp;
}

export const handler: Handler = async (
   event: HandlerEvent,
   context: HandlerContext
) => {
   try {
      const app = await getApp();

      // Convert Netlify event to Fastify request format
      const fastifyResponse = await app.inject({
         method: event.httpMethod as any,
         url: event.path + (event.rawQuery ? `?${event.rawQuery}` : ''),
         headers: event.headers as any,
         payload: event.body || undefined,
      });

      // Return Netlify-compatible response
      return {
         statusCode: fastifyResponse.statusCode,
         headers: fastifyResponse.headers as any,
         body: fastifyResponse.body,
      };
   } catch (error: any) {
      console.error('Netlify Function error:', error);
      console.error('Error stack:', error?.stack);

      return {
         statusCode: 500,
         body: JSON.stringify({
            success: false,
            error: 'Internal Server Error',
            message: error?.message || 'Unknown error occurred',
            ...(process.env.NODE_ENV !== 'production' && {
               stack: error?.stack,
            }),
         }),
      };
   }
};
