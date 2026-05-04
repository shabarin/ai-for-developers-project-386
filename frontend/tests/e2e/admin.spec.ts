import { test, expect } from '@playwright/test';

test.describe('Admin Event Types', () => {
  const uniqueId = `test-${Date.now()}`;

  test.beforeEach(async ({ request }) => {
    await request.delete(`http://localhost:8080/admin/event-types/${uniqueId}`).catch(() => {});
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`http://localhost:8080/admin/event-types/${uniqueId}`).catch(() => {});
  });

  test('should display admin page', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByTestId('admin-page')).toBeVisible();
  });

  test('should create new event type', async ({ page }) => {
    await page.goto('/admin/event-types/new');

    await page.getByLabel('ID').fill(uniqueId);
    await page.getByLabel('Title').fill('Test Event');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByLabel('Duration').fill('30');

    await page.getByTestId('save-button').click();

    await expect(page.getByTestId('admin-page')).toBeVisible();
    await expect(page.getByText('Test Event').first()).toBeVisible();
  });
});
