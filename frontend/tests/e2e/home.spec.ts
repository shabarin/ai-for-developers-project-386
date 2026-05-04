import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kalenda/);
  });

  test('should navigate to admin page', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByTestId('admin-page')).toBeVisible();
  });
});
