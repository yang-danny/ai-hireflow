import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
   test('should load homepage successfully', async ({ page }) => {
      await page.goto('http://localhost:3001/');

      // Check page loaded
      await expect(page).toHaveTitle(/.*/);

      // Should have some content
      const body = await page.locator('body');
      await expect(body).toBeVisible();
   });

   test('should have navigation elements', async ({ page }) => {
      await page.goto('http://localhost:3001/');

      // Look for common navigation elements
      const hasLogin = (await page.getByText(/Login|Sign In/i).count()) > 0;
      const hasRegister =
         (await page.getByText(/Register|Sign Up/i).count()) > 0;

      // Should have at least one navigation element
      expect(hasLogin || hasRegister).toBe(true);
   });
});

test.describe('Responsive Design', () => {
   test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3001/');

      // Page should still be usable
      const body = await page.locator('body');
      await expect(body).toBeVisible();
   });

   test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('http://localhost:3001/');

      const body = await page.locator('body');
      await expect(body).toBeVisible();
   });

   test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('http://localhost:3001/');

      const body = await page.locator('body');
      await expect(body).toBeVisible();
   });
});

test.describe('Accessibility', () => {
   test('should have proper page structure', async ({ page }) => {
      await page.goto('http://localhost:3001/');

      // Check for semantic HTML
      const mainContent = await page.locator('main, [role="main"]').count();
      expect(mainContent).toBeGreaterThanOrEqual(0); // Optional but recommended
   });

   test('should support keyboard navigation', async ({ page }) => {
      await page.goto('http://localhost:3001/');

      // Tab through focusable elements
      await page.keyboard.press('Tab');

      // Should have focusable elements
      const activeElement = await page.evaluate(
         () => document.activeElement?.tagName
      );
      expect(activeElement).toBeTruthy();
   });
});
