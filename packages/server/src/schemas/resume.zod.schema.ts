import { z } from 'zod';

export const uploadResumeSchema = z.object({
   title: z.string(),
   file: z.any(), // Multipart file handling usually requires specific handling, keeping as any for now or specific type if using fastify-multipart
});

export const createResumeSchema = z.object({
   title: z.string().min(1).max(200),
   personal_info: z
      .object({
         image: z.string().optional(),
         full_name: z.string().optional(),
         email: z.string().email().optional(),
         phone: z.string().optional(),
         location: z.string().optional(),
         profession: z.string().optional(),
         linkedin: z.string().optional(),
         github: z.string().optional(),
         website: z.string().optional(),
      })
      .optional(),
   professional_summary: z.string().optional(),
   experience: z
      .array(
         z.object({
            position: z.string().optional(),
            company: z.string().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
            is_current: z.boolean().optional(),
            description: z.string().optional(),
         })
      )
      .optional(),
   education: z
      .array(
         z.object({
            degree: z.string().optional(),
            field: z.string().optional(),
            institution: z.string().optional(),
            gpa: z.string().optional(),
            graduation_date: z.string().optional(),
         })
      )
      .optional(),
   project: z
      .array(
         z.object({
            name: z.string().optional(),
            type: z.string().optional(),
            description: z.string().optional(),
         })
      )
      .optional(),
   skills: z.array(z.string()).optional(),
   template: z.string().optional(),
   accent_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
   public: z.boolean().optional(),
});

export const updateResumeSchema = z.object({
   id: z.string(),
   title: z.string().min(1).max(200).optional(),
   personal_info: z
      .object({
         image: z.string().optional(),
         full_name: z.string().optional(),
         email: z.string().email().optional(),
         phone: z.string().optional(),
         location: z.string().optional(),
         profession: z.string().optional(),
         linkedin: z.string().optional(),
         github: z.string().optional(),
         website: z.string().optional(),
      })
      .optional(),
   professional_summary: z.string().optional(),
   experience: z
      .array(
         z.object({
            position: z.string().optional(),
            company: z.string().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
            is_current: z.boolean().optional(),
            description: z.string().optional(),
         })
      )
      .optional(),
   education: z
      .array(
         z.object({
            degree: z.string().optional(),
            field: z.string().optional(),
            institution: z.string().optional(),
            gpa: z.string().optional(),
            graduation_date: z.string().optional(),
         })
      )
      .optional(),
   project: z
      .array(
         z.object({
            name: z.string().optional(),
            type: z.string().optional(),
            description: z.string().optional(),
         })
      )
      .optional(),
   skills: z.array(z.string()).optional(),
   template: z.string().optional(),
   accent_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
   public: z.boolean().optional(),
});

export const getResumeByIdSchema = z.object({
   id: z.string(),
});

export const getResumesSchema = z.object({
   page: z.coerce.number().default(1),
   limit: z.coerce.number().default(10),
   public: z.coerce.boolean().optional(),
});
