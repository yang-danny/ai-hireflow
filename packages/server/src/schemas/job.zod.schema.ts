import { z } from 'zod';

export const createJobSchema = z.object({
   title: z.string().min(1),
   companyName: z.string().min(1),
   jobTitle: z.string().min(1),
   location: z.string().optional(),
   jobDescription: z.string().min(1),
});

export const updateJobSchema = z.object({
   id: z.string(),
   title: z.string().min(1).optional(),
   companyName: z.string().min(1).optional(),
   jobTitle: z.string().min(1).optional(),
   location: z.string().optional(),
   jobDescription: z.string().min(1).optional(),
});

export const getJobByIdSchema = z.object({
   id: z.string(),
});

export const getJobsSchema = z.object({
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(10),
});
