import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export default async function helmetPlugin(fastify: FastifyInstance) {
   const isProd = process.env.NODE_ENV === 'production';

   await fastify.register(helmet, {
      // Content Security Policy
      contentSecurityPolicy: {
         directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
               "'self'",
               "'unsafe-inline'", // Required for React and some libraries
               "'unsafe-eval'", // May be needed for development
               'https://accounts.google.com', // Google OAuth
            ],
            styleSrc: [
               "'self'",
               "'unsafe-inline'", // Required for styled components
               'https://fonts.googleapis.com',
            ],
            fontSrc: [
               "'self'",
               'https://fonts.gstatic.com',
               'data:', // For base64 fonts
            ],
            imgSrc: [
               "'self'",
               'data:',
               'blob:',
               'https:', // Allow HTTPS images (avatars, etc.)
            ],
            connectSrc: [
               "'self'",
               'https://accounts.google.com',
               'https://oauth2.googleapis.com',
               process.env.CLIENT_URL || 'http://localhost:3001',
            ],
            frameSrc: [
               "'self'",
               'https://accounts.google.com', // Google OAuth
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: isProd ? [] : null,
         },
      },
      // Cross-origin policies
      crossOriginEmbedderPolicy: !isProd,
      crossOriginOpenerPolicy: {
         policy: isProd ? 'same-origin' : 'unsafe-none',
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      // Other security headers
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
         maxAge: 31536000,
         includeSubDomains: true,
         preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
   });

   fastify.log.info(
      `✅ Helmet plugin registered (${isProd ? 'production' : 'development'} mode)`
   );
}
