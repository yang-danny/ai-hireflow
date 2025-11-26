import type { FastifyRequest, FastifyReply } from 'fastify';
import { JobService } from '../services/job.service.js';

interface CreateJobBody {
   title: string;
   companyName: string;
   jobTitle: string;
   location?: string;
   jobDescription: string;
}

interface UpdateJobBody extends Partial<CreateJobBody> {}

interface GetJobParams {
   id: string;
}

interface GetJobsQuery {
   page?: number;
   limit?: number;
}

export class JobController {
   /**
    * Get all jobs for logged-in user
    */
   static async getUserJobs(
      request: FastifyRequest<{ Querystring: GetJobsQuery }>,
      reply: FastifyReply
   ) {
      try {
         const userId = request.user?.id;
         if (!userId) {
            return reply.status(401).send({
               success: false,
               message: 'Unauthorized',
            });
         }

         const { page = 1, limit = 10 } = request.query;

         const result = await JobService.getUserJobs(userId, page, limit);

         return reply.status(200).send({
            success: true,
            message: 'Jobs retrieved successfully',
            data: {
               jobs: result.jobs,
               pagination: {
                  page,
                  limit,
                  total: result.total,
                  pages: result.pages,
               },
            },
         });
      } catch (error: any) {
         return reply.status(500).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Get single job by ID
    */
   static async getJobById(
      request: FastifyRequest<{ Params: GetJobParams }>,
      reply: FastifyReply
   ) {
      try {
         const { id } = request.params;
         const userId = request.user?.id;

         if (!userId) {
            return reply.status(401).send({
               success: false,
               message: 'Unauthorized',
            });
         }

         const job = await JobService.getJobById(id, userId);

         if (!job) {
            return reply.status(404).send({
               success: false,
               message: 'Job not found',
            });
         }

         return reply.status(200).send({
            success: true,
            message: 'Job retrieved successfully',
            data: job,
         });
      } catch (error: any) {
         return reply.status(500).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Create new job
    */
   static async createJob(
      request: FastifyRequest<{ Body: CreateJobBody }>,
      reply: FastifyReply
   ) {
      try {
         const userId = request.user?.id;
         if (!userId) {
            return reply.status(401).send({
               success: false,
               message: 'Unauthorized',
            });
         }

         const job = await JobService.createJob(userId, request.body);

         return reply.status(201).send({
            success: true,
            message: 'Job created successfully',
            data: job,
         });
      } catch (error: any) {
         return reply.status(500).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Update job
    */
   static async updateJob(
      request: FastifyRequest<{
         Params: GetJobParams;
         Body: UpdateJobBody;
      }>,
      reply: FastifyReply
   ) {
      try {
         const userId = request.user?.id;
         if (!userId) {
            return reply.status(401).send({
               success: false,
               message: 'Unauthorized',
            });
         }

         const { id } = request.params;
         const job = await JobService.updateJob(id, userId, request.body);

         if (!job) {
            return reply.status(404).send({
               success: false,
               message: 'Job not found',
            });
         }

         return reply.status(200).send({
            success: true,
            message: 'Job updated successfully',
            data: job,
         });
      } catch (error: any) {
         const statusCode = error.message.includes('not authorized')
            ? 403
            : 500;
         return reply.status(statusCode).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Delete job
    */
   static async deleteJob(
      request: FastifyRequest<{ Params: GetJobParams }>,
      reply: FastifyReply
   ) {
      try {
         const userId = request.user?.id;
         if (!userId) {
            return reply.status(401).send({
               success: false,
               message: 'Unauthorized',
            });
         }

         const { id } = request.params;
         await JobService.deleteJob(id, userId);

         return reply.status(200).send({
            success: true,
            message: 'Job deleted successfully',
         });
      } catch (error: any) {
         const statusCode = error.message.includes('not authorized')
            ? 403
            : 500;
         return reply.status(statusCode).send({
            success: false,
            message: error.message,
         });
      }
   }
}
