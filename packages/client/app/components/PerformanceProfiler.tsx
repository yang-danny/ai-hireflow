import React, { Profiler, type ProfilerOnRenderCallback } from 'react';

interface PerformanceProfilerProps {
   id: string;
   children: React.ReactNode;
   enabled?: boolean;
}

/**
 * React Performance Profiler wrapper
 * Measures component render performance and reports to monitoring
 */
export function PerformanceProfiler({
   id,
   children,
   enabled = import.meta.env.DEV ||
      import.meta.env.VITE_ENABLE_PROFILER === 'true',
}: PerformanceProfilerProps) {
   const onRender: ProfilerOnRenderCallback = (
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
   ) => {
      // Only log if significant render time (> 16ms for 60fps)
      const isSignificant = actualDuration > 16;

      if (import.meta.env.DEV && isSignificant) {
         const color =
            actualDuration > 100
               ? 'red'
               : actualDuration > 50
                 ? 'orange'
                 : 'green';
         console.log(
            `%c[Profiler] ${id} (${phase})`,
            `color: ${color}; font-weight: bold`,
            {
               actualDuration: `${actualDuration.toFixed(2)}ms`,
               baseDuration: `${baseDuration.toFixed(2)}ms`,
               startTime,
               commitTime,
            }
         );
      }

      // Send to Sentry for slow renders (> 100ms)
      if (actualDuration > 100 && window.Sentry) {
         window.Sentry.addBreadcrumb({
            category: 'performance',
            message: `Slow render: ${id}`,
            level: 'warning',
            data: {
               id,
               phase,
               actualDuration,
               baseDuration,
            },
         });
      }

      // Send to custom analytics
      if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
         fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               type: 'react-profiler',
               componentId: id,
               phase,
               actualDuration,
               baseDuration,
               startTime,
               commitTime,
               timestamp: Date.now(),
               url: window.location.href,
            }),
         }).catch(() => {
            // Silently fail - don't disrupt user experience
         });
      }
   };

   if (!enabled) {
      return <>{children}</>;
   }

   return (
      <Profiler id={id} onRender={onRender}>
         {children}
      </Profiler>
   );
}

/**
 * Higher-order component to wrap components with performance profiling
 */
export function withPerformanceProfiler<P extends object>(
   Component: React.ComponentType<P>,
   profileId?: string
) {
   const displayName = Component.displayName || Component.name || 'Component';
   const id = profileId || displayName;

   const WrappedComponent = (props: P) => (
      <PerformanceProfiler id={id}>
         <Component {...props} />
      </PerformanceProfiler>
   );

   WrappedComponent.displayName = `withPerformanceProfiler(${displayName})`;

   return WrappedComponent;
}
