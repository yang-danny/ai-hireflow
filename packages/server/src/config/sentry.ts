import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { FastifyInstance } from 'fastify';

export function initSentry(fastify: FastifyInstance) {
   // Only initialize Sentry if DSN is provided
   const dsn = process.env.SENTRY_DSN;

   if (!dsn) {
      fastify.log.warn('⚠️  Sentry DSN not provided, error tracking disabled');
      return;
   }

   Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',

      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Profiling
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      integrations: [
         // Profiling integration
         nodeProfilingIntegration(),
      ],

      // Release tracking
      release: process.env.npm_package_version,

      // Server name
      serverName: process.env.SERVER_NAME || 'ai-hireflow-api',

      // Before send hook - filter sensitive data
      beforeSend(event, hint) {
         // Remove sensitive headers
         if (event.request?.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
         }

         // Remove sensitive data from context
         if (event.contexts?.runtime?.env) {
            delete event.contexts.runtime.env;
         }

         return event;
      },
   });

   fastify.log.info('✅ Sentry error tracking initialized');
}

// Helper to capture exceptions
export function captureException(error: Error, context?: Record<string, any>) {
   Sentry.captureException(error, {
      extra: context,
   });
}

// Helper to capture messages
export function captureMessage(
   message: string,
   level: Sentry.SeverityLevel = 'info'
) {
   Sentry.captureMessage(message, level);
}

// Helper to add breadcrumb
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
   Sentry.addBreadcrumb(breadcrumb);
}
