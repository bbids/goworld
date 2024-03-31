const { test, expect, chromium } = require('@playwright/test');

/*
  UI tests related to the game
*/

test.describe('Starting a new game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('button', { name: 'Play' }).click();
  });

  test('Game is created', async ({ page }) => {
    // game room loads
    await expect(page.getByRole('heading', { name: 'Attempting' })).toBeVisible();
  });

});

test.describe('Joining the game page', () => {
  let pageA;
  test.beforeEach(async () => {
    const browserA = await chromium.launch();
    pageA = await browserA.newPage();
    await pageA.goto('/play');
    await pageA.getByRole('button', { name: 'Play' }).click();
  });

  test('navigates both players to game', async ({ page }) => {
    await page.goto('/play');
    await page
      .getByRole('link', { name: 'Join' })
      .click();

    await expect(
      page
        .getByRole('button', { name: 'sayHi' })
    ).toBeVisible();

    await expect(
      pageA
        .getByRole('button', { name: 'sayHi' })
    ).toBeVisible();
  });

});