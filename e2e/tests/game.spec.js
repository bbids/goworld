// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Online game room creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('link', { name: 'create game' }).click();
  });

  test('Game is created', async ({ page }) => {
    // game room loads
    await expect(page.getByRole('heading', { name: 'Attempting'})).toBeVisible();

    // game is created
    await expect(page.getByRole('heading', { name: 'Game ID:'})).toBeVisible();
  });

});

test.describe('Joining a game room', () => {
  let gameId;
  test.beforeEach(async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('link', { name: 'create game' }).click();
    gameId = await page.locator('#gameId').textContent();
  });

  test('an opponent can join', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`/join/${gameId}`);
    await expect(page.getByRole('heading', { name: 'Game ID:'})).toBeVisible();
  });
});