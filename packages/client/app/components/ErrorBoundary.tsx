import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
   children: ReactNode;
   fallback?: ReactNode;
}

interface State {
   hasError: boolean;
   error: Error | null;
}

/**
 * Error Boundary Component for React
 * Catches errors in child components and displays fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = {
         hasError: false,
         error: null,
      };
   }

   static getDerivedStateFromError(error: Error): State {
      return {
         hasError: true,
         error,
      };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // Log error to console in development
      console.error('Error Boundary caught an error:', error, errorInfo);

      // Send to Sentry if configured
      if (import.meta.env.VITE_SENTRY_DSN) {
         Sentry.captureException(error, {
            contexts: {
               react: {
                  componentStack: errorInfo.componentStack,
               },
            },
         });
      }
   }

   handleReset = () => {
      this.setState({
         hasError: false,
         error: null,
      });
   };

   render() {
      if (this.state.hasError) {
         // Custom fallback UI
         if (this.props.fallback) {
            return this.props.fallback;
         }

         // Default fallback UI
         return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark px-4">
               <div className="max-w-md w-full bg-(--color-background-card) rounded-lg border border-(--color-border) p-8 shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full">
                     <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                     </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-center mb-2 text-(--color-text-primary)">
                     Oops! Something went wrong
                  </h2>

                  <p className="text-center text-(--color-text-secondary) mb-6">
                     We're sorry for the inconvenience. The error has been
                     reported and we'll look into it.
                  </p>

                  {this.state.error && import.meta.env.DEV && (
                     <div className="mb-6 p-4 bg-gray-800 rounded border border-gray-700 overflow-auto">
                        <p className="text-xs font-mono text-red-400">
                           {this.state.error.toString()}
                        </p>
                     </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                     <button
                        onClick={this.handleReset}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                     >
                        Try Again
                     </button>
                     <button
                        onClick={() => (window.location.href = '/')}
                        className="flex-1 px-4 py-2 bg-transparent border border-(--color-border) text-(--color-text-primary) rounded-lg font-medium hover:bg-gray-800 transition-colors"
                     >
                        Go Home
                     </button>
                  </div>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
