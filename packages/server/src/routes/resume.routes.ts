import type { FastifyInstance } from 'fastify';
import { ResumeController } from '../controllers/resume.controller.js';
import {
   createResumeSchema,
   updateResumeSchema,
   getResumeByIdSchema,
   getResumesSchema,
} from '../schemas/resume.schema.js';

export default async function resumeRoutes(fastify: FastifyInstance) {
   // Get all resumes for logged-in user (protected)
   fastify.get('/', {
      onRequest: [fastify.authenticate],
      schema: getResumesSchema,
      handler: ResumeController.getUserResumes,
   });

   // Get public resumes (no auth required)
   fastify.get('/public', {
      schema: getResumesSchema,
      handler: ResumeController.getPublicResumes,
   });

   // Get single resume by ID
   fastify.get('/:id', {
      schema: getResumeByIdSchema,
      handler: ResumeController.getResumeById,
   });

   // Create new resume (protected)
   fastify.post('/', {
      onRequest: [fastify.authenticate],
      schema: createResumeSchema,
      handler: ResumeController.createResume,
   });

   // Update resume (protected)
   fastify.put('/:id', {
      onRequest: [fastify.authenticate],
      schema: updateResumeSchema,
      handler: ResumeController.updateResume,
   });

   // Delete resume (protected)
   fastify.delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: getResumeByIdSchema,
      handler: ResumeController.deleteResume,
   });

   // Toggle public status (protected)
   fastify.patch('/:id/toggle-public', {
      onRequest: [fastify.authenticate],
      schema: getResumeByIdSchema,
      handler: ResumeController.togglePublicStatus,
   });

   // Duplicate resume (protected)
   fastify.post('/:id/duplicate', {
      onRequest: [fastify.authenticate],
      schema: getResumeByIdSchema,
      handler: ResumeController.duplicateResume,
   });
}
