import { useEffect } from 'react';
import { initWebVitals } from '../utils/webVitals.js';
import { initSentry } from '../utils/sentry.js';

/**
 * Performance monitoring initialization hook
 * Call this in the root component to start monitoring
 */
export function usePerformanceMonitoring() {
   useEffect(() => {
      // Initialize Sentry performance monitoring
      initSentry();

      // Initialize Web Vitals tracking
      initWebVitals();

      if (import.meta.env.DEV) {
         console.log('✅ Performance monitoring active');
      }
   }, []);
}
