import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry with performance monitoring
 */
export function initSentry() {
   // Only initialize in production or if explicitly enabled
   const shouldInitialize =
      import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true';

   if (!shouldInitialize) {
      console.log('Sentry disabled in development');
      return;
   }

   const dsn = import.meta.env.VITE_SENTRY_DSN;
   if (!dsn) {
      console.warn('Sentry DSN not configured');
      return;
   }

   Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',

      // Performance Monitoring
      integrations: [
         // Browser tracing for automatic performance instrumentation
         Sentry.browserTracingIntegration(),
         // Replay integration for session replay (optional)
         Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
         }),
      ],

      // Performance traces sample rate (0.0 to 1.0)
      // In production, sample 10% of transactions
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

      // Session replay sample rate
      replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
      replaysOnErrorSampleRate: 1.0,

      // Ignore specific errors
      ignoreErrors: [
         // Browser extensions
         'top.GLOBALS',
         'ResizeObserver loop limit exceeded',
         // Network errors
         'NetworkError',
         'Network request failed',
         // Common React errors that are handled
         'ChunkLoadError',
      ],

      // Filter sensitive data
      beforeSend(event) {
         // Don't send events in development unless explicitly enabled
         if (
            import.meta.env.DEV &&
            import.meta.env.VITE_ENABLE_SENTRY !== 'true'
         ) {
            return null;
         }

         // Remove sensitive data from breadcrumbs
         if (event.breadcrumbs) {
            event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
               if (breadcrumb.data) {
                  // Remove tokens, passwords, etc.
                  delete breadcrumb.data.token;
                  delete breadcrumb.data.password;
                  delete breadcrumb.data.apiKey;
               }
               return breadcrumb;
            });
         }

         return event;
      },

      // Configure allowed URLs
      allowUrls: [/https?:\/\/(.*)\.ai-hireflow\.com/, /localhost/],
   });

   console.log('✅ Sentry Performance Monitoring initialized');
}

// Export Sentry for use in other files
export { Sentry };
