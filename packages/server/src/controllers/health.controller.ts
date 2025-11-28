import type { FastifyRequest, FastifyReply } from 'fastify';
import mongoose from 'mongoose';
import logger from '../config/logger.js';

interface HealthCheckResult {
   status: 'healthy' | 'unhealthy' | 'degraded';
   timestamp: string;
   uptime: number;
   memory: NodeJS.MemoryUsage;
   database: {
      status: 'connected' | 'disconnected' | 'connecting';
      responseTime?: number;
   };
   redis: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
   };
   version: string;
   environment: string;
}

/**
 * Check Redis connection health
 */
async function checkRedisHealth(redis: any): Promise<{
   status: 'connected' | 'disconnected';
   responseTime?: number;
}> {
   const startTime = Date.now();

   try {
      if (!redis) {
         return { status: 'disconnected' };
      }

      await redis.ping();
      const responseTime = Date.now() - startTime;

      return {
         status: 'connected',
         responseTime,
      };
   } catch (error) {
      logger.error('Redis health check failed:', error);
      return {
         status: 'disconnected',
      };
   }
}

/**
 * Check database connection health
 */
async function checkDatabaseHealth(): Promise<{
   status: 'connected' | 'disconnected' | 'connecting';
   responseTime?: number;
}> {
   const startTime = Date.now();

   try {
      const state = mongoose.connection.readyState;
      const responseTime = Date.now() - startTime;

      const status =
         state === 1
            ? 'connected'
            : state === 2
              ? 'connecting'
              : 'disconnected';

      // Perform a simple query to verify connection
      if (state === 1 && mongoose.connection.db) {
         await mongoose.connection.db.admin().ping();
      }

      return {
         status,
         responseTime,
      };
   } catch (error) {
      logger.error('Database health check failed:', error);
      return {
         status: 'disconnected',
      };
   }
}

/**
 * Health check endpoint handler
 */
export async function healthCheck(
   request: FastifyRequest,
   reply: FastifyReply
) {
   try {
      const dbHealth = await checkDatabaseHealth();
      const redisHealth = await checkRedisHealth(request.server.redis);

      const memoryUsage = process.memoryUsage();
      const heapUsedPercentage =
         (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      // Determine overall health status
      let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

      if (
         dbHealth.status === 'disconnected' ||
         redisHealth.status === 'disconnected'
      ) {
         overallStatus = 'unhealthy';
      } else if (dbHealth.status === 'connecting' || heapUsedPercentage > 90) {
         overallStatus = 'degraded';
      }

      const healthData: HealthCheckResult = {
         status: overallStatus,
         timestamp: new Date().toISOString(),
         uptime: process.uptime(),
         memory: memoryUsage,
         database: dbHealth,
         redis: redisHealth,
         version: process.env.npm_package_version || '1.0.0',
         environment: process.env.NODE_ENV || 'development',
      };

      // Set status code based on health
      const statusCode =
         overallStatus === 'healthy'
            ? 200
            : overallStatus === 'degraded'
              ? 200
              : 503;

      return reply.status(statusCode).send(healthData);
   } catch (error) {
      logger.error('Health check error:', error);
      return reply.status(503).send({
         status: 'unhealthy',
         error: 'Health check failed',
         timestamp: new Date().toISOString(),
      });
   }
}

/**
 * Readiness check - is the service ready to handle requests?
 */
export async function readinessCheck(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const dbHealth = await checkDatabaseHealth();
   const redisHealth = await checkRedisHealth(request.server.redis);

   if (dbHealth.status === 'connected' && redisHealth.status === 'connected') {
      return reply.status(200).send({
         status: 'ready',
         timestamp: new Date().toISOString(),
      });
   }

   return reply.status(503).send({
      status: 'not ready',
      reason: 'Database not connected',
      timestamp: new Date().toISOString(),
   });
}

/**
 * Liveness check - is the service alive?
 */
export async function livenessCheck(
   request: FastifyRequest,
   reply: FastifyReply
) {
   return reply.status(200).send({
      status: 'alive',
      timestamp: new Date().toISOString(),
   });
}
