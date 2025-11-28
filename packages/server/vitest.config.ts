import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
   test: {
      globals: true,
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      coverage: {
         provider: 'v8',
         reporter: ['text', 'html', 'lcov'],
         exclude: [
            'node_modules/',
            'src/__tests__/',
            '**/*.d.ts',
            '**/*.config.*',
            '**/dist/',
         ],
         thresholds: {
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80,
         },
      },
      testTimeout: 10000,
      fileParallelism: false,
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
});
