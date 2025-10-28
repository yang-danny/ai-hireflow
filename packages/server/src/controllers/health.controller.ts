import type { FastifyRequest, FastifyReply } from 'fastify';

export const healthCheck = async (
   request: FastifyRequest,
   reply: FastifyReply
) => {
   return reply.code(200).send({
      success: true,
      message: 'Server is running',
      data: {
         status: 'OK',
         timestamp: new Date().toISOString(),
         uptime: process.uptime(),
         environment: process.env.NODE_ENV,
         memoryUsage: process.memoryUsage(),
      },
   });
};
