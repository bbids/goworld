const { test, expect } = require('@playwright/test');

test.describe('Visiting the play page', () => {

  test('has heading', async ({ page }) => {
    await page.goto('/play');

    // Expect a title "to contain" a substring.
    await expect(page.getByRole('heading', { name: 'Go World' })).toBeVisible();
  });

  test('has play button', async ({ page }) => {
    await page.goto('/play');

    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  });
});

test.describe('Seeing games available', async () => {

  test('on 0 open games shows "no games available"', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const json = {}
      await route.fulfill({ json });
    });

    await page.goto('/play');

    await expect(
      page
        .getByRole('paragraph')
        .filter({ hasText: 'No games available' })
    ).toBeVisible();
  });

  test('on 1 open game, shows it', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const gamedata = {};
      gamedata["9139473"] = { "gameId": "9139473", "count": 1, "status": "WAITING" };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gamedata)
      });
    });
    await page.goto('/play');
    await expect(
      page
        .getByRole('link', { name: 'Join' })
    ).toHaveCount(1)

  });

  test('on 2 open games, show them both', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const gamedata = {};
      gamedata["9139473"] = { "gameId": "9139473", "count": 1, "status": "WAITING" };
      gamedata["7248142"] = { "gameId": "7248142", "count": 1, "status": "WAITING" };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gamedata)
      });
    });

    await page.goto('/play');
    await expect(
      page
        .getByRole('link', { name: 'Join' })
    ).toHaveCount(2);
  })

  test('shows only those with status WAITING', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const gamedata = {};
      gamedata["9139473"] = { "gameId": "9139473", "count": 1, "status": "WAITING" };
      gamedata["7248142"] = { "gameId": "7248142", "count": 1, "status": "WAITING" };
      gamedata["1111111"] = { "gameId": "1111111", "count": 1, "status": "GAME_START" };
      gamedata["2222222"] = { "gameId": "2222222", "count": 1, "status": "random" };
      gamedata["1323212"] = { "gameId": "1323212", "count": 1, "status": "" };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gamedata)
      });
    });

    await page.goto('/play');
    await expect(
      page
        .getByRole('link', { name: 'Join' })
    ).toHaveCount(2);
  });

});

test.describe('Creating a game', async () => {
  test('creating game, doesn\'t change the open game list', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const gamedata = {};
      gamedata["9139473"] = { "gameId": "9139473", "count": 1, "status": "WAITING" };
      gamedata["7248142"] = { "gameId": "7248142", "count": 1, "status": "WAITING" };
      gamedata["1111111"] = { "gameId": "1111111", "count": 1, "status": "GAME_START" };
      gamedata["2222222"] = { "gameId": "2222222", "count": 1, "status": "random" };
      gamedata["1323212"] = { "gameId": "1323212", "count": 1, "status": "" };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gamedata)
      });
    });

    await page.goto('/play');
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(
      page
        .getByRole('link', { name: 'Join' })
    ).toHaveCount(2);
  });

  test('shows the search game card', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const gamedata = {};
      gamedata["9139473"] = { "gameId": "9139473", "count": 1, "status": "WAITING" };
      gamedata["7248142"] = { "gameId": "7248142", "count": 1, "status": "WAITING" };
      gamedata["1111111"] = { "gameId": "1111111", "count": 1, "status": "GAME_START" };
      gamedata["2222222"] = { "gameId": "2222222", "count": 1, "status": "random" };
      gamedata["1323212"] = { "gameId": "1323212", "count": 1, "status": "" };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gamedata)
      });
    });

    await page.goto('/play');
    await page.getByRole('button', { name: 'Play'}).click();
    await expect (
      page
        .getByText('Attempting to join game')
    ).toBeVisible();

    await expect(
      page
        .getByRole('button', { name: 'Stop'})
    ).toBeVisible();

  });

  test('leaving play page, and coming back stops queue', async ({ page }) => {
    await page.route('*/**/api/play', async route => {
      const gamedata = {};
      gamedata["9139473"] = { "gameId": "9139473", "count": 1, "status": "WAITING" };
      gamedata["7248142"] = { "gameId": "7248142", "count": 1, "status": "WAITING" };
      gamedata["1111111"] = { "gameId": "1111111", "count": 1, "status": "GAME_START" };
      gamedata["2222222"] = { "gameId": "2222222", "count": 1, "status": "random" };
      gamedata["1323212"] = { "gameId": "1323212", "count": 1, "status": "" };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gamedata)
      });
    });

    await page.goto('/play');
    await page.getByRole('button', { name: 'Play' }).click();

    await page.goto('/');

    await page.goto('/play');
    await expect (
      page.getByText('Attempting to join game')
    ).toBeHidden();

    await expect(
      page
        .getByRole('link', { name: 'Join' })
    ).toHaveCount(2);
  });
});