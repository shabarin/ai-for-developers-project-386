import { test, expect } from '@playwright/test';
import dayjs from 'dayjs';

const API_BASE = 'http://localhost:8080';

test.describe('Booking Calendar Slot Display', () => {
  let eventTypeId: string;
  let dateWithSlots: string;
  let dateAriaLabel: string;

  test.beforeAll(async () => {
    eventTypeId = 'evt-playwright-' + Date.now();

    const createRes = await fetch(`${API_BASE}/admin/event-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: eventTypeId,
        title: 'Playwright Test Event',
        duration: 15,
      }),
    });
    expect(createRes.ok).toBeTruthy();
    const eventType = await createRes.json();
    expect(eventType.id).toBe(eventTypeId);

    // Wait a moment for slot generation
    await new Promise((resolve) => setTimeout(resolve, 100));

    const today = dayjs().format('YYYY-MM-DD');
    const nextWeek = dayjs().add(7, 'day').format('YYYY-MM-DD');
    const slotsRes = await fetch(
      `${API_BASE}/public/event-types/${eventTypeId}/slots?startDate=${today}&endDate=${nextWeek}`
    );
    expect(slotsRes.ok).toBeTruthy();
    const slots = await slotsRes.json();

    const availableSlots = slots.filter(
      (s: any) => s.isAvailable && dayjs(s.startAt).isAfter(dayjs())
    );
    expect(availableSlots.length).toBeGreaterThan(0);

    const slotDates = new Set(
      availableSlots.map((s: any) => dayjs(s.startAt).format('YYYY-MM-DD'))
    );
    dateWithSlots = Array.from(slotDates)[0] as string;
    dateAriaLabel = dayjs(dateWithSlots).format('MMMM D, YYYY');
  });

  test.afterAll(async () => {
    // Cleanup: delete the test event type
    await fetch(`${API_BASE}/admin/event-types/${eventTypeId}`, {
      method: 'DELETE',
    });
  });

  test('selecting a date shows available time slots', async ({ page }) => {
    await page.goto(`/book/${eventTypeId}`);

    // Wait for calendar to load
    await expect(page.getByTestId('slots-calendar')).toBeVisible();

    // Wait for slots to load
    await page.waitForLoadState('networkidle');

    // Click on the date with available slots using the day number
    const dayOfMonth = dayjs(dateWithSlots).format('D');
    const dateButton = page.getByRole('button', { name: dayOfMonth }).first();
    await expect(dateButton).toBeVisible({ timeout: 10000 });
    await dateButton.click();

    // Verify slot buttons appear
    const slotButtons = page.getByTestId('slot-button');
    await expect(slotButtons.first()).toBeVisible({ timeout: 10000 });
    await expect(slotButtons).not.toHaveCount(0);
  });
});
