import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app.js';
import User from '../models/User.model.js';
import type { FastifyInstance } from 'fastify';
describe('Authentication', () => {
   let app: FastifyInstance;

   beforeEach(async () => {
      app = await buildApp();
      await app.ready();
   }, 30000); // 30 second timeout for initialization

   afterEach(async () => {
      if (app) {
         await app.close();
      }
   }, 30000);
   describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
         const uniqueEmail = `test-${Date.now()}@example.com`;
         const response = await request(app.server)
            .post('/api/auth/register')
            .send({
               email: uniqueEmail,
               password: 'SecurePass123!',
               name: 'Test User',
            })
            .expect(201);

         expect(response.body.success).toBe(true);
         expect(response.body.data.user.email).toBe(uniqueEmail);
         expect(response.body.data.token).toBeDefined();
      });
      it('should reject duplicate email', async () => {
         const uniqueEmail = `test-${Date.now()}@example.com`;
         // Create user first
         await request(app.server).post('/api/auth/register').send({
            email: uniqueEmail,
            password: 'SecurePass123!',
            name: 'First User',
         });

         const response = await request(app.server)
            .post('/api/auth/register')
            .send({
               email: uniqueEmail,
               password: 'SecurePass123!',
               name: 'Test User',
            })
            .expect(400);
         expect(response.body.success).toBe(false);
      });
      it('should reject weak passwords', async () => {
         const response = await request(app.server)
            .post('/api/auth/register')
            .send({
               email: 'test@example.com',
               password: '123',
               name: 'Test User',
            })
            .expect(400);
         expect(response.body.success).toBe(false);
      });
   });
   describe('POST /api/auth/login', () => {
      it('should login with valid credentials', async () => {
         const uniqueEmail = `test-${Date.now()}@example.com`;
         const password = 'SecurePass123!';

         // Register user first
         await request(app.server).post('/api/auth/register').send({
            email: uniqueEmail,
            password,
            name: 'Test User',
         });
         const response = await request(app.server)
            .post('/api/auth/login')
            .send({
               email: uniqueEmail,
               password,
            })
            .expect(200);
         expect(response.body.success).toBe(true);
         expect(response.body.data.token).toBeDefined();
      });
      it('should reject invalid credentials', async () => {
         const response = await request(app.server)
            .post('/api/auth/login')
            .send({
               email: 'test@example.com',
               password: 'WrongPassword',
            })
            .expect(401);
         expect(response.body.success).toBe(false);
      });
      it('should respect rate limiting', async () => {
         // Attempt 6 logins (limit is 5 in 15 min)
         const promises = Array.from({ length: 6 }).map(() =>
            request(app.server).post('/api/auth/login').send({
               email: 'test@example.com',
               password: 'wrong',
            })
         );
         const responses = await Promise.all(promises);
         const lastResponse = responses[responses.length - 1];
         expect(lastResponse.status).toBe(429);
      });
   });
});
