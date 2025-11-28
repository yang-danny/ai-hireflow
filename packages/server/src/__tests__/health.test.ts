import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app.js';
import type { FastifyInstance } from 'fastify';

describe('Health Checks', () => {
   let app: FastifyInstance;

   beforeEach(async () => {
      app = await buildApp();
      await app.ready();
      if (app.redis) {
         await app.redis.flushall();
      }
   }, 30000);

   afterEach(async () => {
      if (app) {
         await app.close();
      }
   }, 30000);

   describe('GET /api/health', () => {
      it('should return 200 and healthy status', async () => {
         const response = await request(app.server)
            .get('/api/health')
            .expect(200);

         expect(response.body.status).toBe('healthy');
         expect(response.body.database.status).toBe('connected');
         expect(response.body.redis.status).toBe('connected');
         expect(response.body.version).toBeDefined();
      });
   });

   describe('GET /api/health/ready', () => {
      it('should return 200 when services are ready', async () => {
         const response = await request(app.server)
            .get('/api/health/ready')
            .expect(200);

         expect(response.body.status).toBe('ready');
      });
   });

   describe('GET /api/health/live', () => {
      it('should return 200 and alive status', async () => {
         const response = await request(app.server)
            .get('/api/health/live')
            .expect(200);

         expect(response.body.status).toBe('alive');
      });
   });
});
