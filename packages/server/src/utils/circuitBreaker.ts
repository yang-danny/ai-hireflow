import CircuitBreaker from 'opossum';
import logger from '../config/logger.js';

export interface CircuitBreakerOptions {
   timeout?: number; // default: 3000ms
   errorThresholdPercentage?: number; // default: 50%
   resetTimeout?: number; // default: 30000ms (30s)
   rollingCountTimeout?: number; //  default: 10000ms (10s)
   rollingCountBuckets?: number; // default: 10
   name?: string;
}

/**
 * Create a circuit breaker for a function
 */
export function createCircuitBreaker<T extends any[], R>(
   fn: (...args: T) => Promise<R>,
   options: CircuitBreakerOptions = {}
): CircuitBreaker<T, R> {
   const breaker = new CircuitBreaker(fn, {
      timeout: options.timeout || 3000, // 3 seconds
      errorThresholdPercentage: options.errorThresholdPercentage || 50,
      resetTimeout: options.resetTimeout || 30000, // 30 seconds
      rollingCountTimeout: options.rollingCountTimeout || 10000,
      rollingCountBuckets: options.rollingCountBuckets || 10,
      name: options.name || 'circuit-breaker',
   });

   // Event handlers
   breaker.on('open', () => {
      logger.warn(`Circuit breaker opened: ${options.name || 'unknown'}`);
   });

   breaker.on('halfOpen', () => {
      logger.info(`Circuit breaker half-open: ${options.name || 'unknown'}`);
   });

   breaker.on('close', () => {
      logger.info(`Circuit breaker closed: ${options.name || 'unknown'}`);
   });

   breaker.on('fallback', (result: any) => {
      logger.warn(
         `Circuit breaker fallback executed: ${options.name || 'unknown'}`
      );
   });

   breaker.on('failure', (error: Error) => {
      logger.error(
         `Circuit breaker failure: ${options.name || 'unknown'}`,
         error
      );
   });

   breaker.on('timeout', () => {
      logger.warn(`Circuit breaker timeout: ${options.name || 'unknown'}`);
   });

   return breaker;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
   fn: () => Promise<T>,
   options: {
      maxRetries?: number;
      initialDelay?: number;
      maxDelay?: number;
      backoffFactor?: number;
      retryableErrors?: string[];
   } = {}
): Promise<T> {
   const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      retryableErrors = [],
   } = options;

   let lastError: Error;
   let delay = initialDelay;

   for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
         return await fn();
      } catch (error: any) {
         lastError = error;

         // Check if error is retryable
         if (retryableErrors.length > 0) {
            const isRetryable = retryableErrors.some(
               (errName) => error.name === errName || error.code === errName
            );
            if (!isRetryable) {
               throw error;
            }
         }

         if (attempt < maxRetries) {
            logger.warn(
               `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
               { error: error.message }
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * backoffFactor, maxDelay);
         }
      }
   }

   throw lastError!;
}

/**
 * Create a circuit breaker with retry logic
 */
export function createResilientFunction<T extends any[], R>(
   fn: (...args: T) => Promise<R>,
   circuitBreakerOptions: CircuitBreakerOptions = {},
   retryOptions?: Parameters<typeof retryWithBackoff>[1]
) {
   const breaker = createCircuitBreaker(async (...args: T) => {
      return await retryWithBackoff(() => fn(...args), retryOptions);
   }, circuitBreakerOptions);

   return breaker;
}

/**
 * Default fallback function
 */
export function defaultFallback<T>(defaultValue: T) {
   return () => {
      logger.warn('Using fallback value');
      return defaultValue;
   };
}
