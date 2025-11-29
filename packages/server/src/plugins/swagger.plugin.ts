import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

async function swaggerPlugin(fastify: FastifyInstance) {
   const isProd = process.env.NODE_ENV === 'production';

   // Register Swagger for OpenAPI spec generation
   await fastify.register(fastifySwagger, {
      openapi: {
         openapi: '3.1.0',
         info: {
            title: 'AI-HireFlow API',
            description:
               'AI-powered career tools API for resume generation, cover letters, and interview preparation',
            version: '1.0.0',
            contact: {
               name: 'AI-HireFlow Support',
               url: 'https://github.com/yang-danny/AI-HireFlow',
            },
            license: {
               name: 'MIT',
               url: 'https://opensource.org/licenses/MIT',
            },
         },
         servers: [
            {
               url: isProd
                  ? 'https://api.ai-hireflow.com'
                  : 'http://localhost:3000',
               description: isProd ? 'Production Server' : 'Development Server',
            },
         ],
         components: {
            securitySchemes: {
               bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                  description: 'JWT token authentication',
               },
               cookieAuth: {
                  type: 'apiKey',
                  in: 'cookie',
                  name: 'token',
                  description: 'Session cookie authentication',
               },
            },
         },
         tags: [
            { name: 'Health', description: 'Health check endpoints' },
            {
               name: 'Authentication',
               description: 'User authentication and authorization',
            },
            { name: 'Users', description: 'User management endpoints' },
            { name: 'Resumes', description: 'Resume CRUD operations' },
            { name: 'Jobs', description: 'Job tracking and management' },
         ],
      },
      transform: ({ schema, url }) => {
         // Transform Zod schemas to OpenAPI format
         return { schema, url };
      },
   });

   // Register Swagger UI for interactive documentation
   await fastify.register(fastifySwaggerUi, {
      routePrefix: '/api/docs',
      uiConfig: {
         docExpansion: 'list',
         deepLinking: true,
         displayRequestDuration: true,
         filter: true,
         showExtensions: true,
         showCommonExtensions: true,
         syntaxHighlight: {
            activate: true,
            theme: 'monokai',
         },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => {
         return swaggerObject;
      },
   });

   fastify.log.info('✅ Swagger documentation configured at /api/docs');
}

export default fp(swaggerPlugin);
