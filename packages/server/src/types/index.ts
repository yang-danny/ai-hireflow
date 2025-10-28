import type { FastifyRequest, FastifyReply } from 'fastify';

export interface IUser {
   id: string;
   email: string;
   name: string;
   role: 'admin' | 'recruiter' | 'candidate';
   createdAt: Date;
}

export interface ApiResponse<T = any> {
   success: boolean;
   message: string;
   data?: T;
   error?: string;
}

export interface CustomError extends Error {
   statusCode?: number;
   status?: string;
}

export type FastifyRouteHandler = (
   request: FastifyRequest,
   reply: FastifyReply
) => Promise<any>;

export interface GoogleUserInfo {
   sub: string;
   email: string;
   name: string;
   picture?: string;
   email_verified?: boolean;
}
