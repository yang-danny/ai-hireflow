import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (
   error: FastifyError,
   request: FastifyRequest,
   reply: FastifyReply
) => {
   const statusCode = error.statusCode || 500;

   // ALWAYS set CORS headers, even on errors
   const origin = request.headers.origin || 'http://localhost:3001';
   reply.header('Access-Control-Allow-Origin', origin);
   reply.header('Access-Control-Allow-Credentials', 'true');
   reply.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
   );
   reply.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Cookie'
   );

   console.error('Error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      statusCode,
      url: request.url,
      method: request.method,
   });

   reply.status(statusCode).send({
      success: false,
      message: error.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && {
         stack: error.stack,
         validation: error.validation,
      }),
   });
};
