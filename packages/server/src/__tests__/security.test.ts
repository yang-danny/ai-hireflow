import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app.js';
import type { FastifyInstance } from 'fastify';
import User from '../models/User.model.js';
import bcrypt from 'bcrypt';

describe('Security - NoSQL Injection', () => {
   let app: FastifyInstance;
   let adminToken: string;

   beforeEach(async () => {
      app = await buildApp();
      await app.ready();

      if (app.redis) {
         await app.redis.flushall();
      }

      // Create admin user for testing
      const admin = await User.create({
         name: 'Admin User',
         email: 'admin@example.com',
         password: await bcrypt.hash('password123', 10),
         role: 'admin',
         isVerified: true,
      });

      // Create regular user
      await User.create({
         name: 'Regular User',
         email: 'user@example.com',
         password: await bcrypt.hash('password123', 10),
         role: 'candidate',
         isVerified: true,
      });

      // Login as admin to get token
      const loginRes = await request(app.server).post('/api/auth/login').send({
         email: 'admin@example.com',
         password: 'password123',
      });

      adminToken = loginRes.body.data.token;
   }, 30000);

   afterEach(async () => {
      await User.deleteMany({});
      if (app) {
         await app.close();
      }
   }, 30000);

   it('should prevent NoSQL injection in query parameters', async () => {
      // Attempt to find users where role is NOT equal to 'candidate' using injection
      // This targets the getUsers endpoint which uses req.query directly
      const response = await request(app.server)
         .get('/api/users')
         .query({ role: { $ne: 'candidate' } }) // Injection attempt
         .set('Authorization', `Bearer ${adminToken}`);

      // If protected, this should either fail validation or return empty/sanitized results
      // If vulnerable, it might return the admin user (role: 'admin') because 'admin' != 'candidate'

      // We expect the server to either:
      // 1. Reject the request (400 Bad Request) due to validation
      // 2. Sanitize the input so it searches for role = "[object Object]" or similar, returning 0 results

      // If it returns users, it means the injection worked (vulnerable)
      // Note: In a real attack, this could bypass filters.

      // Since Fastify's default parser ignores nested objects in query strings,
      // the injection payload { role: { $ne: 'candidate' } } is treated as missing 'role'.
      // Thus, it returns ALL users (2).
      // This confirms that the injection did NOT execute as intended (filtering by $ne).

      if (response.status === 200) {
         expect(response.body.data.users).toHaveLength(2);
      } else {
         expect(response.status).not.toBe(500);
      }
   });

   it('should prevent NoSQL injection in login body', async () => {
      // Attempt login bypass with NoSQL injection
      const response = await request(app.server)
         .post('/api/auth/login')
         .send({
            email: { $ne: null },
            password: { $ne: null },
         });

      // Should be rejected by Zod or Sanitization
      expect(response.status).toBe(400);
   });
});
