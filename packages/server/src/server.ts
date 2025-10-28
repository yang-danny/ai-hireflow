import { buildApp } from './app';
import { Logger } from './utils/logger';

async function start() {
   try {
      const fastify = await buildApp();

      const port = Number(process.env.PORT) || 3000;
      const host = process.env.HOST || '0.0.0.0';

      await fastify.listen({ port, host });

      console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 AI-HireFlow Backend (Fastify)    ║
  ║                                       ║
  ║   Module: ESM ⚡                      ║
  ║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(19)}    ║
  ║   Port: ${String(port).padEnd(28)}  ║
  ║   URL: http://localhost:${port}${' '.repeat(10)}║
  ║                                       ║
  ║   Status: ✅ Running                  ║
  ╚═══════════════════════════════════════╝
    `);

      // Graceful shutdown
      const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

      for (const signal of signals) {
         process.on(signal, async () => {
            Logger.info(`${signal} received, shutting down gracefully`);
            await fastify.close();
            Logger.success('Server closed successfully');
            process.exit(0);
         });
      }
   } catch (error) {
      Logger.error('Error starting server:', error);
      process.exit(1);
   }
}

start();
