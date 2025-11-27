import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
   plugins: [react()],
   test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./app/__tests__/setup.ts'],
      coverage: {
         provider: 'v8',
         reporter: ['text', 'html', 'lcov'],
         exclude: [
            'node_modules/',
            'app/__tests__/',
            '**/*.d.ts',
            '**/*.config.*',
            '**/build/',
         ],
         thresholds: {
            lines: 60,
            functions: 60,
            branches: 60,
            statements: 60,
         },
      },
   },
   resolve: {
      alias: {
         '~': path.resolve(__dirname, './app'),
      },
   },
});
