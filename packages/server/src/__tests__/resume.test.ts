import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app.js';
import { FastifyInstance } from 'fastify';
import User from '../models/User.model.js';
import Resume from '../models/Resume.model.js';

describe('Resume CRUD Operations', () => {
   let app: FastifyInstance;
   let token: string;
   let userId: string;

   beforeEach(async () => {
      app = await buildApp();
      await app.ready();
      if (app.redis) {
         await app.redis.flushall();
      }

      // Create authenticated user
      const uniqueEmail = `test-${Date.now()}@example.com`;
      const response = await request(app.server)
         .post('/api/auth/register')
         .send({
            email: uniqueEmail,
            password: 'SecurePass123!',
            name: 'Test User',
         });
      token = response.body.data.token;
      userId = response.body.data.user._id;
   }, 30000);

   afterEach(async () => {
      if (app) {
         await app.close();
      }
   }, 30000);
   describe('POST /api/resumes', () => {
      it('should create a new resume', async () => {
         const response = await request(app.server)
            .post('/api/resumes')
            .set('Authorization', `Bearer ${token}`)
            .send({
               title: 'Software Engineer Resume',
               personal_info: {
                  full_name: 'John Doe',
                  email: 'john@example.com',
               },
               professional_summary: 'Experienced developer...',
            })
            .expect(201);
         expect(response.body.success).toBe(true);
         expect(response.body.data.title).toBe('Software Engineer Resume');
      });
      it('should reject unauthenticated requests', async () => {
         await request(app.server)
            .post('/api/resumes')
            .send({ title: 'Test Resume' })
            .expect(401);
      });
   });
   describe('GET /api/resumes', () => {
      it('should get user resumes', async () => {
         // Create resume first
         await request(app.server)
            .post('/api/resumes')
            .set('Authorization', `Bearer ${token}`)
            .send({
               title: 'Resume 1',
               personal_info: { full_name: 'Test' },
            });
         const response = await request(app.server)
            .get('/api/resumes')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
         expect(response.body.success).toBe(true);
         expect(response.body.data.resumes.length).toBeGreaterThan(0);
      });
      it('should support pagination', async () => {
         const response = await request(app.server)
            .get('/api/resumes?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
         expect(response.body.data.pagination).toBeDefined();
      });
   });
   describe('PUT /api/resumes/:id', () => {
      it('should update resume', async () => {
         // Create resume
         const createResponse = await request(app.server)
            .post('/api/resumes')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Original Title' });
         const resumeId = createResponse.body.data._id;
         // Update resume
         const response = await request(app.server)
            .put(`/api/resumes/${resumeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Title' })
            .expect(200);
         expect(response.body.data.title).toBe('Updated Title');
      });
      it('should not allow updating other users resumes', async () => {
         // Create another user
         const user2Email = `user2-${Date.now()}@example.com`;
         const user2Response = await request(app.server)
            .post('/api/auth/register')
            .send({
               email: user2Email,
               password: 'Pass123!',
               name: 'User 2',
            });
         const user2Token = user2Response.body.data.token;
         // User 1 creates resume
         const createResponse = await request(app.server)
            .post('/api/resumes')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'User 1 Resume' });
         const resumeId = createResponse.body.data._id;
         // User 2 tries to update
         await request(app.server)
            .put(`/api/resumes/${resumeId}`)
            .set('Authorization', `Bearer ${user2Token}`)
            .send({ title: 'Hacked' })
            .expect(403);
      });
   });
   describe('DELETE /api/resumes/:id', () => {
      it('should delete resume', async () => {
         // Create resume
         const createResponse = await request(app.server)
            .post('/api/resumes')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'To Delete' });
         const resumeId = createResponse.body.data._id;
         // Delete resume
         await request(app.server)
            .delete(`/api/resumes/${resumeId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
         // Verify deleted
         await request(app.server)
            .get(`/api/resumes/${resumeId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
      });
   });
});
