import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  const uniqueId = `test-booking-${Date.now()}`;

  test.beforeEach(async ({ request }) => {
    await request.post('http://localhost:8080/admin/event-types', {
      data: {
        id: uniqueId,
        title: 'Test Booking Event',
        description: 'For testing',
        duration: 30,
      },
    });
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`http://localhost:8080/admin/event-types/${uniqueId}`);
  });

  test('should navigate to booking page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const eventCard = page.getByTestId('event-type-card').filter({ hasText: 'Test Booking Event' });
    await expect(eventCard).toBeVisible();

    await eventCard.getByTestId('event-type-link').click();

    await expect(page).toHaveURL(/\/book\//);
    await expect(page.getByTestId('book-page')).toBeVisible();
  });

  test('should display calendar on booking page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const eventCard = page.getByTestId('event-type-card').filter({ hasText: 'Test Booking Event' });
    await eventCard.getByTestId('event-type-link').click();

    await expect(page.getByTestId('slots-calendar')).toBeVisible();
  });
});
