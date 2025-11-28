import type { FastifyInstance } from 'fastify';
import { JobController } from '../controllers/job.controller.js';
import {
   createJobSchema,
   updateJobSchema,
   getJobByIdSchema,
   getJobsSchema,
} from '../schemas/job.zod.schema.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function jobRoutes(fastify: FastifyInstance) {
   // Get all jobs for logged-in user (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/', {
      onRequest: [fastify.authenticate],
      schema: { querystring: getJobsSchema },
      handler: JobController.getUserJobs,
   });

   // Get single job by ID (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/:id', {
      onRequest: [fastify.authenticate],
      schema: { params: getJobByIdSchema },
      handler: JobController.getJobById,
   });

   // Create new job (protected)
   fastify.withTypeProvider<ZodTypeProvider>().post('/', {
      onRequest: [fastify.authenticate],
      schema: { body: createJobSchema },
      handler: JobController.createJob,
   });

   // Update job (protected)
   fastify.withTypeProvider<ZodTypeProvider>().put('/:id', {
      onRequest: [fastify.authenticate],
      schema: {
         params: getJobByIdSchema,
         body: updateJobSchema.omit({ id: true }), // id is in params
      },
      handler: JobController.updateJob,
   });

   // Delete job (protected)
   fastify.withTypeProvider<ZodTypeProvider>().delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: { params: getJobByIdSchema },
      handler: JobController.deleteJob,
   });
}
