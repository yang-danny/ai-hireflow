import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../app.js';
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import User from '../models/User.model.js';

describe('JWT Token Validation', () => {
   let app: FastifyInstance;
   let token: string;
   let testEmail: string;

   beforeEach(async () => {
      app = await buildApp();
      await app.ready();
      if (app.redis) {
         await app.redis.flushall();
      }

      // Register and get token
      testEmail = `test-${Date.now()}@example.com`;
      const response = await request(app.server)
         .post('/api/auth/register')
         .send({
            email: testEmail,
            password: 'SecurePass123!',
            name: 'Test User',
         });
      token = response.body.data.token;
   }, 30000);

   afterEach(async () => {
      if (app) {
         await app.close();
      }
   }, 30000);
   it('should accept valid JWT token', async () => {
      const response = await request(app.server)
         .get('/api/auth/me')
         .set('Authorization', `Bearer ${token}`)
         .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testEmail);
   });
   it('should reject missing token', async () => {
      await request(app.server).get('/api/auth/me').expect(401);
   });
   it('should reject invalid token', async () => {
      await request(app.server)
         .get('/api/auth/me')
         .set('Authorization', 'Bearer invalid_token')
         .expect(401);
   });
   it('should reject expired token', async () => {
      // This would require manipulating token expiry
      // Or using a test-specific token with short expiry
   });
});
