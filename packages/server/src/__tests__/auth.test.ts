import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app.js';
import User from '../models/User.model.js';
import type { FastifyInstance } from 'fastify';
import { testData } from './helpers/testData.js';
describe('Authentication', () => {
   let app: FastifyInstance;

   beforeEach(async () => {
      app = await buildApp();
      await app.ready();
      if (app.redis) {
         await app.redis.flushall();
      }
   }, 30000); // 30 second timeout for initialization

   afterEach(async () => {
      if (app) {
         await app.close();
      }
   }, 30000);
   describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
         const userData = testData.user();
         const response = await request(app.server)
            .post('/api/auth/register')
            .send(userData)
            .expect(201);

         expect(response.body.success).toBe(true);
         expect(response.body.data.user.email).toBe(userData.email);
         expect(response.body.data.token).toBeDefined();
      });
      it('should reject duplicate email', async () => {
         const userData = testData.user();
         // Create user first
         await request(app.server).post('/api/auth/register').send(userData);

         const response = await request(app.server)
            .post('/api/auth/register')
            .send(userData)
            .expect(400);
         expect(response.body.success).toBe(false);
      });
      it('should reject weak passwords', async () => {
         const userData = testData.user();
         const response = await request(app.server)
            .post('/api/auth/register')
            .send({
               ...userData,
               password: '123', // Weak password
            })
            .expect(400);

         expect(response.body.success).toBe(false);
      });
      it('should reject invalid email format', async () => {
         const userData = testData.user();
         const response = await request(app.server)
            .post('/api/auth/register')
            .send({
               ...userData,
               email: 'invalid-email',
            })
            .expect(400);
         expect(response.body.success).toBe(false);
      });
   });
   describe('POST /api/auth/login', () => {
      it('should login with valid credentials', async () => {
         const userData = testData.user();

         // Register user first
         await request(app.server).post('/api/auth/register').send(userData);

         const response = await request(app.server)
            .post('/api/auth/login')
            .send({
               email: userData.email,
               password: userData.password,
            })
            .expect(200);

         expect(response.body.success).toBe(true);
         expect(response.body.data.token).toBeDefined();
      });

      it('should reject invalid credentials', async () => {
         const userData = testData.user();

         const response = await request(app.server)
            .post('/api/auth/login')
            .send({
               email: userData.email,
               password: 'WrongPassword123!',
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

   describe('POST /api/auth/me', () => {
      it('should return current user with valid token', async () => {
         const userData = testData.user();

         // Register and login
         const registerRes = await request(app.server)
            .post('/api/auth/register')
            .send(userData);

         const token = registerRes.body.data.token;

         const response = await request(app.server)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

         expect(response.body.success).toBe(true);
         expect(response.body.data.email).toBe(userData.email);
      });
   });
});
