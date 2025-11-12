import type { FastifyRequest, FastifyReply } from 'fastify';
import { ResumeService } from '../services/resume.service.js';

interface CreateResumeBody {
   title: string;
   personal_info?: any;
   professional_summary?: string;
   experience?: any[];
   education?: any[];
   project?: any[];
   skills?: string[];
   template?: string;
   accent_color?: string;
   public?: boolean;
}

interface UpdateResumeBody extends Partial<CreateResumeBody> {}

interface GetResumeParams {
   id: string;
}

interface GetResumesQuery {
   page?: number;
   limit?: number;
   public?: boolean;
}

interface UploadResumeBody {
   title: string;
   file: any;
}

export class ResumeController {
   /**
    * Upload a new resume
    */
   static async uploadResume(
      request: FastifyRequest<{ Body: UploadResumeBody }>,
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

         const { title, file } = request.body;
         const resume = await ResumeService.createResume(userId, {
            title,
            // Add other fields from the file if necessary
         });

         return reply.status(201).send({
            success: true,
            message: 'Resume uploaded successfully',
            data: resume,
         });
      } catch (error: any) {
         return reply.status(500).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Get all resumes for logged-in user
    */
   static async getUserResumes(
      request: FastifyRequest<{ Querystring: GetResumesQuery }>,
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

         const result = await ResumeService.getUserResumes(userId, page, limit);

         return reply.status(200).send({
            success: true,
            message: 'Resumes retrieved successfully',
            data: {
               resumes: result.resumes,
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
    * Get single resume by ID
    */
   static async getResumeById(
      request: FastifyRequest<{ Params: GetResumeParams }>,
      reply: FastifyReply
   ) {
      try {
         const { id } = request.params;
         const userId = request.user?.id;

         const resume = await ResumeService.getResumeById(id, userId);

         if (!resume) {
            return reply.status(404).send({
               success: false,
               message: 'Resume not found',
            });
         }

         return reply.status(200).send({
            success: true,
            message: 'Resume retrieved successfully',
            data: resume,
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
    * Create new resume
    */
   static async createResume(
      request: FastifyRequest<{ Body: CreateResumeBody }>,
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

         const resume = await ResumeService.createResume(userId, request.body);

         return reply.status(201).send({
            success: true,
            message: 'Resume created successfully',
            data: resume,
         });
      } catch (error: any) {
         return reply.status(500).send({
            success: false,
            message: error.message,
         });
      }
   }

   /**
    * Update resume
    */
   static async updateResume(
      request: FastifyRequest<{
         Params: GetResumeParams;
         Body: UpdateResumeBody;
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
         const resume = await ResumeService.updateResume(
            id,
            userId,
            request.body
         );

         if (!resume) {
            return reply.status(404).send({
               success: false,
               message: 'Resume not found',
            });
         }

         return reply.status(200).send({
            success: true,
            message: 'Resume updated successfully',
            data: resume,
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
    * Delete resume
    */
   static async deleteResume(
      request: FastifyRequest<{ Params: GetResumeParams }>,
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
         await ResumeService.deleteResume(id, userId);

         return reply.status(200).send({
            success: true,
            message: 'Resume deleted successfully',
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
    * Toggle public status
    */
   static async togglePublicStatus(
      request: FastifyRequest<{ Params: GetResumeParams }>,
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
         const resume = await ResumeService.togglePublicStatus(id, userId);

         return reply.status(200).send({
            success: true,
            message: `Resume is now ${resume?.public ? 'public' : 'private'}`,
            data: resume,
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
    * Get public resumes
    */
   static async getPublicResumes(
      request: FastifyRequest<{ Querystring: GetResumesQuery }>,
      reply: FastifyReply
   ) {
      try {
         const { page = 1, limit = 10 } = request.query;

         const result = await ResumeService.getPublicResumes(page, limit);

         return reply.status(200).send({
            success: true,
            message: 'Public resumes retrieved successfully',
            data: {
               resumes: result.resumes,
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
    * Duplicate resume
    */
   static async duplicateResume(
      request: FastifyRequest<{ Params: GetResumeParams }>,
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
         const newResume = await ResumeService.duplicateResume(id, userId);

         return reply.status(201).send({
            success: true,
            message: 'Resume duplicated successfully',
            data: newResume,
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
