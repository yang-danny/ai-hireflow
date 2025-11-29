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

// Schema for updating user - all fields are optional for partial updates
export const updateUserSchema = z
   .object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      role: z.enum(['admin', 'recruiter', 'candidate']).optional(),
      avatar: z.string().url().optional().nullable(),
      isEmailVerified: z.boolean().optional(),
   })
   .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
   });
