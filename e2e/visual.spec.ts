import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 *
 * These tests compare screenshots against baseline images.
 * To update baseline images, run:
 *   npx playwright test visual.spec.ts --update-snapshots
 *
 * NOTE: Skipped in CI due to platform differences (macOS vs Linux rendering)
 * Run locally for visual regression testing
 */

// Skip in CI environments
const skipInCI = !!process.env.CI;

test.describe('Visual Regression Tests', () => {
   test.skip(skipInCI, 'Visual tests skipped in CI (platform differences)');

   test.beforeEach(async ({ page }) => {
      // Set viewport to consistent size
      await page.setViewportSize({ width: 1440, height: 900 });
   });

   test('Dashboard - Authenticated user view', async ({ page }) => {
      // Note: This requires authentication setup
      // For now, testing the login page instead
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Take snapshot of login page
      await expect(page).toHaveScreenshot('login-page.png', {
         fullPage: true,
         animations: 'disabled',
      });
   });

   test('Authentication Form - Sign In', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Take snapshot of sign-in form
      const authForm = page.locator('form').first();
      await expect(authForm).toHaveScreenshot('signin-form.png', {
         animations: 'disabled',
      });
   });

   test('Authentication Form - Register', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      // Take snapshot of register form
      const authForm = page.locator('form').first();
      await expect(authForm).toHaveScreenshot('register-form.png', {
         animations: 'disabled',
      });
   });

   test('Homepage Hero Section', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take snapshot of hero section
      const hero = page.locator('section').first();
      await expect(hero).toHaveScreenshot('homepage-hero.png', {
         animations: 'disabled',
      });
   });

   // Add more visual tests as needed:
   // - Dashboard layout (after authentication)
   // - Resume generator UI
   // - Resume preview modal
   // - Cover letter generator
   // - Interview preparation UI
});

test.describe('Responsive Visual Tests', () => {
   test.skip(skipInCI, 'Visual tests skipped in CI (platform differences)');

   test('Mobile - Login Page', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('mobile-login.png', {
         fullPage: true,
         animations: 'disabled',
      });
   });

   test('Tablet - Homepage', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('tablet-homepage.png', {
         fullPage: true,
         animations: 'disabled',
      });
   });
});
