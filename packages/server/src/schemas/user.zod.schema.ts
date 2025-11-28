import { z } from 'zod';

export const createUserSchema = z.object({
   name: z.string().min(2).max(100),
   email: z.string().email(),
   role: z.enum(['admin', 'recruiter', 'candidate']).default('candidate'),
});

export const getUserByIdSchema = z.object({
   id: z.string(),
});

export const getUsersSchema = z.object({
   page: z.coerce.number().default(1),
   limit: z.coerce.number().default(10),
   role: z.enum(['admin', 'recruiter', 'candidate']).optional(),
});
