const { test, expect, chromium } = require('@playwright/test');

/*
  UI tests related to the game
*/

test.describe('Joining the game page', () => {
  let pageA;
  let gameId;
  test.beforeEach(async () => {
    const browserA = await chromium.launch();
    pageA = await browserA.newPage();

    await pageA.route('*/**/api/play/create_game', async route => {
      const response = await route.fetch();

      const body = await response.json();

      gameId = body.gameId;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(body)
      });
    });

    await pageA.goto('/play');
    await pageA.getByRole('button', { name: 'Play' }).click();
  });

  test('navigates both players to game', async ({ page }) => {
    await page.goto('/play');
    await page
      .locator(`[href*="${gameId}"]`)
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