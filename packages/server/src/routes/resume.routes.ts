import type { FastifyInstance } from 'fastify';
import { ResumeController } from '../controllers/resume.controller.js';
import {
   createResumeSchema,
   updateResumeSchema,
   getResumeByIdSchema,
   getResumesSchema,
} from '../schemas/resume.zod.schema.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function resumeRoutes(fastify: FastifyInstance) {
   // Upload new resume (protected)
   // fastify.withTypeProvider<ZodTypeProvider>().post('/upload', {
   //    onRequest: [fastify.authenticate],
   //    schema: { body: uploadResumeSchema },
   //    handler: ResumeController.uploadResume,
   // });

   // Get all resumes for logged-in user (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/', {
      onRequest: [fastify.authenticate],
      schema: { querystring: getResumesSchema },
      handler: ResumeController.getUserResumes,
   });

   // Get public resumes (no auth required)
   fastify.withTypeProvider<ZodTypeProvider>().get('/public', {
      schema: { querystring: getResumesSchema },
      handler: ResumeController.getPublicResumes,
   });

   // Get single resume by ID
   fastify.withTypeProvider<ZodTypeProvider>().get('/:id', {
      schema: { params: getResumeByIdSchema },
      handler: ResumeController.getResumeById,
   });

   // Create new resume (protected)
   fastify.withTypeProvider<ZodTypeProvider>().post('/', {
      onRequest: [fastify.authenticate],
      schema: { body: createResumeSchema },
      handler: ResumeController.createResume,
   });

   // Update resume (protected)
   fastify.withTypeProvider<ZodTypeProvider>().put('/:id', {
      onRequest: [fastify.authenticate],
      schema: {
         params: getResumeByIdSchema,
         body: updateResumeSchema.omit({ id: true }), // id is in params
      },
      handler: ResumeController.updateResume,
   });

   // Delete resume (protected)
   fastify.withTypeProvider<ZodTypeProvider>().delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: { params: getResumeByIdSchema },
      handler: ResumeController.deleteResume,
   });

   // Toggle public status (protected)
   fastify.withTypeProvider<ZodTypeProvider>().patch('/:id/toggle-public', {
      onRequest: [fastify.authenticate],
      schema: { params: getResumeByIdSchema },
      handler: ResumeController.togglePublicStatus,
   });

   // Duplicate resume (protected)
   // fastify.withTypeProvider<ZodTypeProvider>().post('/:id/duplicate', {
   //    onRequest: [fastify.authenticate],
   //    schema: { params: getResumeByIdSchema },
   //    handler: ResumeController.duplicateResume,
   // });
}
