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
} from '../schemas/user.zod.schema.js';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function userRoutes(fastify: FastifyInstance) {
   // GET /api/users - Get all users (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/', {
      onRequest: [fastify.authenticate],
      schema: { querystring: getUsersSchema },
      handler: getUsers,
   });

   // GET /api/users/:id - Get user by ID (protected)
   fastify.withTypeProvider<ZodTypeProvider>().get('/:id', {
      onRequest: [fastify.authenticate],
      schema: { params: getUserByIdSchema },
      handler: getUserById,
   });

   // POST /api/users - Create new user (admin only - for now just protected)
   fastify.withTypeProvider<ZodTypeProvider>().post('/', {
      onRequest: [fastify.authenticate],
      schema: { body: createUserSchema },
      handler: createUser,
   });

   // POST /api/users/avatar - Upload avatar (protected)
   fastify.post('/avatar', {
      onRequest: [fastify.authenticate],
      handler: uploadAvatar,
   });

   // PUT /api/users/:id - Update user (protected)
   fastify.withTypeProvider<ZodTypeProvider>().put('/:id', {
      onRequest: [fastify.authenticate],
      schema: {
         params: getUserByIdSchema,
         // body: updateUserSchema // TODO: Add updateUserSchema
      },
      handler: updateUser,
   });

   // DELETE /api/users/:id - Delete user (protected)
   fastify.withTypeProvider<ZodTypeProvider>().delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: { params: getUserByIdSchema },
      handler: deleteUser,
   });
}
