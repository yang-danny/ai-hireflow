import { buildApp } from './app.js';
import { Logger } from './utils/logger.js';
import { ImageService } from './services/image.service.js';

async function start() {
   try {
      // Initialize image service
      await ImageService.init();

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

            // Force exit after 10 seconds if graceful shutdown hangs
            const forceExitTimeout = setTimeout(() => {
               Logger.error('Force shutting down due to timeout');
               process.exit(1);
            }, 10000);

            try {
               await fastify.close();
               clearTimeout(forceExitTimeout);
               Logger.success('Server closed successfully');
               process.exit(0);
            } catch (err) {
               Logger.error('Error during shutdown:', err);
               process.exit(1);
            }
         });
      }
   } catch (error) {
      console.error('❌ FATAL ERROR starting server:');
      console.error(error);
      Logger.error('Error starting server:', error);
      process.exit(1);
   }
}

start();
