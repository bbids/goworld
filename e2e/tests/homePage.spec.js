// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Visiting the play page', async () => {

  test('has heading', async ({ page }) => {
    await page.goto('/play');
  
    // Expect a title "to contain" a substring.
    await expect(page.getByRole('heading', { name: 'Go World' })).toBeVisible();
  });
  
  test('has create game link', async ({ page }) => {
    await page.goto('/play');
  
    await expect(page.getByRole('link', { name: 'create game' })).toBeVisible();
  });
});