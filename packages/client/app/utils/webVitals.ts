import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals thresholds (Google's recommended values)
 * Good: green, Needs Improvement: yellow, Poor: red
 */
const VITALS_THRESHOLDS = {
   CLS: { good: 0.1, poor: 0.25 },
   FID: { good: 100, poor: 300 },
   FCP: { good: 1800, poor: 3000 },
   INP: { good: 200, poor: 500 },
   LCP: { good: 2500, poor: 4000 },
   TTFB: { good: 800, poor: 1800 },
};

/**
 * Get rating for a metric value
 */
function getRating(
   name: string,
   value: number
): 'good' | 'needs-improvement' | 'poor' {
   const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];
   if (!threshold) return 'good';

   if (value <= threshold.good) return 'good';
   if (value <= threshold.poor) return 'needs-improvement';
   return 'poor';
}

/**
 * Send metric to analytics/monitoring service
 */
function sendToAnalytics(metric: Metric) {
   const { name, value, rating, delta, id } = metric;

   // Log to console in development
   if (import.meta.env.DEV) {
      const customRating = getRating(name, value);
      const color =
         customRating === 'good'
            ? 'green'
            : customRating === 'needs-improvement'
              ? 'orange'
              : 'red';
      console.log(
         `%c[Web Vitals] ${name}`,
         `color: ${color}; font-weight: bold`,
         `${value.toFixed(2)}ms`,
         `(${customRating})`
      );
   }

   // Send to Sentry (if configured)
   if (window.Sentry) {
      window.Sentry.captureMessage(`Web Vital: ${name}`, {
         level: 'info',
         tags: {
            web_vital: name,
            rating: getRating(name, value),
         },
         contexts: {
            performance: {
               name,
               value,
               rating,
               delta,
               id,
            },
         },
      });
   }

   // Send to Google Analytics (if configured)
   if (window.gtag) {
      window.gtag('event', name, {
         event_category: 'Web Vitals',
         value: Math.round(name === 'CLS' ? value * 1000 : value),
         event_label: id,
         non_interaction: true,
      });
   }

   // Custom analytics endpoint (optional)
   if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            type: 'web-vital',
            name,
            value,
            rating: getRating(name, value),
            delta,
            id,
            timestamp: Date.now(),
            url: window.location.href,
         }),
      }).catch((error) => {
         console.error('Failed to send web vital:', error);
      });
   }
}

/**
 * Initialize Web Vitals tracking
 * Measures Core Web Vitals + additional metrics
 */
export function initWebVitals() {
   // Core Web Vitals
   onCLS(sendToAnalytics); // Cumulative Layout Shift
   onLCP(sendToAnalytics); // Largest Contentful Paint
   onINP(sendToAnalytics); // Interaction to Next Paint (replaces FID)

   // Additional metrics
   onFCP(sendToAnalytics); // First Contentful Paint
   onTTFB(sendToAnalytics); // Time to First Byte

   if (import.meta.env.DEV) {
      console.log('✅ Web Vitals tracking initialized');
   }
}

/**
 * TypeScript declaration for global window objects
 */
declare global {
   interface Window {
      Sentry?: any;
      gtag?: (...args: any[]) => void;
   }
}
