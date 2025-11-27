import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
   testDir: './e2e',
   fullyParallel: true,
   forbidOnly: !!process.env.CI,
   retries: process.env.CI ? 2 : 1, // Retry once for flaky tests
   workers: process.env.CI ? 1 : undefined,
   reporter: 'html',
   timeout: 45000, // Increase global timeout to 45s

   use: {
      baseURL: 'http://localhost:5173',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      actionTimeout: 15000, // Increase action timeout
      viewport: { width: 1440, height: 900 }, // Explicitly set large viewport for desktop sidebar
   },

   projects: [
      {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
      },
      {
         name: 'firefox',
         use: { ...devices['Desktop Firefox'] },
      },
      {
         name: 'webkit',
         use: { ...devices['Desktop Safari'] },
      },
   ],

   // Comment out if dev server is already running
   // webServer: {
   //    command: 'npm run dev',
   //    url: 'http://localhost:5173',
   //    reuseExistingServer: !process.env.CI,
   //    timeout: 120000,
   // },
});
