// Require the framework and instantiate it

// ESM
import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
   logger: true,
});
await fastify.register(cors, {
   // put your options here
   origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
   credentials: true,
});
// Declare a route
fastify.get('/api', function (request, reply) {
   reply.send({ message: 'Hello from Fastify!' });
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
   if (err) {
      fastify.log.error(err);
      process.exit(1);
   }
   // Server is now listening on ${address}
});
