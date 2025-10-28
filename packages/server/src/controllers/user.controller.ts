import type { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User.model.js';

interface CreateUserBody {
   name: string;
   email: string;
   role?: 'admin' | 'recruiter' | 'candidate';
}

interface GetUserParams {
   id: string;
}

interface GetUsersQuery {
   page?: number;
   limit?: number;
   role?: string;
}

export const getUsers = async (
   request: FastifyRequest<{ Querystring: GetUsersQuery }>,
   reply: FastifyReply
) => {
   try {
      const { page = 1, limit = 10, role } = request.query;

      const query: any = {};
      if (role) {
         query.role = role;
      }

      const users = await User.find(query)
         .select('-password')
         .limit(limit)
         .skip((page - 1) * limit)
         .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      return reply.code(200).send({
         success: true,
         message: 'Users retrieved successfully',
         data: {
            users,
            pagination: {
               page,
               limit,
               total,
               pages: Math.ceil(total / limit),
            },
         },
      });
   } catch (error: any) {
      return reply.code(500).send({
         success: false,
         message: error.message,
      });
   }
};

export const getUserById = async (
   request: FastifyRequest<{ Params: GetUserParams }>,
   reply: FastifyReply
) => {
   try {
      const { id } = request.params;

      const user = await User.findById(id).select('-password');

      if (!user) {
         return reply.code(404).send({
            success: false,
            message: 'User not found',
         });
      }

      return reply.code(200).send({
         success: true,
         message: 'User retrieved successfully',
         data: user,
      });
   } catch (error: any) {
      return reply.code(500).send({
         success: false,
         message: error.message,
      });
   }
};

export const createUser = async (
   request: FastifyRequest<{ Body: CreateUserBody }>,
   reply: FastifyReply
) => {
   try {
      const { name, email, role = 'candidate' } = request.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return reply.code(400).send({
            success: false,
            message: 'User already exists with this email',
         });
      }

      const newUser = await User.create({
         name,
         email,
         role,
      });

      return reply.code(201).send({
         success: true,
         message: 'User created successfully',
         data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
         },
      });
   } catch (error: any) {
      return reply.code(500).send({
         success: false,
         message: error.message,
      });
   }
};

export const updateUser = async (
   request: FastifyRequest<{
      Params: GetUserParams;
      Body: Partial<CreateUserBody>;
   }>,
   reply: FastifyReply
) => {
   try {
      const { id } = request.params;
      const updates = request.body;

      const user = await User.findByIdAndUpdate(
         id,
         { $set: updates },
         { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
         return reply.code(404).send({
            success: false,
            message: 'User not found',
         });
      }

      return reply.code(200).send({
         success: true,
         message: 'User updated successfully',
         data: user,
      });
   } catch (error: any) {
      return reply.code(500).send({
         success: false,
         message: error.message,
      });
   }
};

export const deleteUser = async (
   request: FastifyRequest<{ Params: GetUserParams }>,
   reply: FastifyReply
) => {
   try {
      const { id } = request.params;

      const user = await User.findByIdAndDelete(id);

      if (!user) {
         return reply.code(404).send({
            success: false,
            message: 'User not found',
         });
      }

      return reply.code(200).send({
         success: true,
         message: 'User deleted successfully',
         data: { id },
      });
   } catch (error: any) {
      return reply.code(500).send({
         success: false,
         message: error.message,
      });
   }
};
