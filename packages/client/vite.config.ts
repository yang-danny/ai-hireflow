import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
   plugins: [
      {
         name: 'chrome-devtools-fix',
         configureServer(server) {
            server.middlewares.use((req, res, next) => {
               if (
                  req.url ===
                  '/.well-known/appspecific/com.chrome.devtools.json'
               ) {
                  res.statusCode = 204;
                  res.end();
               } else {
                  next();
               }
            });
         },
      },
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
   ],
   build: {
      // Optimize build output
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: process.env.NODE_ENV !== 'production',
      cssCodeSplit: true,

      // Manual chunk splitting for better caching
      rollupOptions: {
         output: {
            manualChunks: {
               // Core React dependencies
               'react-vendor': ['react', 'react-dom', 'react-router-dom'],

               // PDF generation libraries (heavy, load on demand)
               'pdf-utils': ['html2pdf.js', 'jspdf', 'html2canvas'],

               // UI libraries
               'ui-vendor': ['lucide-react', 'react-dropzone'],

               // State management
               'state-vendor': ['zustand'],
            },
         },
      },

      // Chunk size warnings
      chunkSizeWarningLimit: 1000, // 1MB
   },

   // Performance optimizations
   optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
   },
});
