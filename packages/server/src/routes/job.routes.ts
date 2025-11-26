import type { FastifyInstance } from 'fastify';
import { JobController } from '../controllers/job.controller.js';
import {
   createJobSchema,
   updateJobSchema,
   getJobByIdSchema,
   getJobsSchema,
} from '../schemas/job.schema.js';

export default async function jobRoutes(fastify: FastifyInstance) {
   // Get all jobs for logged-in user (protected)
   fastify.get('/', {
      onRequest: [fastify.authenticate],
      schema: getJobsSchema,
      handler: JobController.getUserJobs,
   });

   // Get single job by ID (protected)
   fastify.get('/:id', {
      onRequest: [fastify.authenticate],
      schema: getJobByIdSchema,
      handler: JobController.getJobById,
   });

   // Create new job (protected)
   fastify.post('/', {
      onRequest: [fastify.authenticate],
      schema: createJobSchema,
      handler: JobController.createJob,
   });

   // Update job (protected)
   fastify.put('/:id', {
      onRequest: [fastify.authenticate],
      schema: updateJobSchema,
      handler: JobController.updateJob,
   });

   // Delete job (protected)
   fastify.delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: getJobByIdSchema,
      handler: JobController.deleteJob,
   });
}
