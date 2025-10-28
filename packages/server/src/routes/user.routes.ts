import type { FastifyInstance } from 'fastify';
import {
   getUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
} from '../controllers/user.controller.js';
import {
   createUserSchema,
   getUserByIdSchema,
   getUsersSchema,
} from '../schemas/user.schema.js';

export default async function userRoutes(fastify: FastifyInstance) {
   // GET /api/users - Get all users (protected)
   fastify.get('/', {
      onRequest: [fastify.authenticate],
      schema: getUsersSchema,
      handler: getUsers,
   });

   // GET /api/users/:id - Get user by ID (protected)
   fastify.get('/:id', {
      onRequest: [fastify.authenticate],
      schema: getUserByIdSchema,
      handler: getUserById,
   });

   // POST /api/users - Create new user (admin only - for now just protected)
   fastify.post('/', {
      onRequest: [fastify.authenticate],
      schema: createUserSchema,
      handler: createUser,
   });

   // PUT /api/users/:id - Update user (protected)
   fastify.put('/:id', {
      onRequest: [fastify.authenticate],
      schema: getUserByIdSchema,
      handler: updateUser,
   });

   // DELETE /api/users/:id - Delete user (protected)
   fastify.delete('/:id', {
      onRequest: [fastify.authenticate],
      schema: getUserByIdSchema,
      handler: deleteUser,
   });
}
