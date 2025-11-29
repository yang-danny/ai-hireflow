import type { FastifyInstance } from 'fastify';
import {
   getUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
   uploadAvatar,
} from '../controllers/user.controller.js';
import {
   createUserSchema,
   getUserByIdSchema,
   getUsersSchema,
   updateUserSchema,
} from '../schemas/user.zod.schema.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function userRoutes(fastify: FastifyInstance) {
   // GET /api/users - Get all users (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/', {
      onRequest: [fastify.authenticate],
      schema: {
         tags: ['Users'],
         summary: 'Get all users',
         description:
            'Retrieve a paginated list of users with optional role filtering',
         security: [{ bearerAuth: [] }],
         querystring: getUsersSchema,
      },
      handler: getUsers,
   });

   // GET /api/users/:id - Get user by ID (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/:id', {
      onRequest: [fastify.authenticate],
      schema: {
         tags: ['Users'],
         summary: 'Get user by ID',
         description: 'Retrieve detailed information about a specific user',
         security: [{ bearerAuth: [] }],
         params: getUserByIdSchema,
      },
      handler: getUserById,
   });

   // POST /api/users - Create new user (admin only - for now just protected)
   fastify.withTypeProvider<ZodTypeProvider>().post('/', {
      onRequest: [fastify.authenticate],
      schema: {
         tags: ['Users'],
         summary: 'Create new user',
         description: 'Create a new user account (admin only)',
         security: [{ bearerAuth: [] }],
         body: createUserSchema,
      },
      handler: createUser,
   });

   // POST /api/users/avatar - Upload avatar (protected)
   fastify.post('/avatar', {
      onRequest: [fastify.authenticate],
      schema: {
         tags: ['Users'],
         summary: 'Upload user avatar',
         description: 'Upload a profile picture for the authenticated user',
         security: [{ bearerAuth: [] }],
      },
      handler: uploadAvatar,
   });

   // PUT /api/users/:id - Update user (protected)
   fastify.withTypeProvider<ZodTypeProvider>().put('/:id', {
      onRequest: [fastify.authenticate],
      schema: {
         tags: ['Users'],
         summary: 'Update user',
         description: 'Update user information (partial updates supported)',
         security: [{ bearerAuth: [] }],
         params: getUserByIdSchema,
         body: updateUserSchema,
      },
      handler: updateUser,
   });

   // DELETE /api/users/:id - Delete user (protected)
   fastify.withTypeProvider<ZodTypeProvider>().delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: {
         tags: ['Users'],
         summary: 'Delete user',
         description: 'Delete a user account permanently',
         security: [{ bearerAuth: [] }],
         params: getUserByIdSchema,
      },
      handler: deleteUser,
   });
}
