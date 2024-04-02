const { test, expect, chromium } = require('@playwright/test');

/*
  WebSocket tests related to the game
*/

test.describe('game websocket suite', () => {

  let pageA;
  let gameId;
  test.beforeEach(async () => {
    const browserA = await chromium.launch();
    pageA = await browserA.newPage();

    // spy on response to get gameId
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

  // test('both clients receive GAME_READY EVENT');
  // test('both clients reply with GAME_READY')

  test('joining an open game triggers GAME_START', async ({ page }) => {
    let connected = false;

    page.on('websocket', ws => {
      ws.on('framereceived', data => {
        const wsData = JSON.parse(data.payload);
        if (wsData.type === 'EVENT' && wsData.eventName === 'GAME_START') {
          connected = true;
        }
      });
    });

    await page.goto('/play');
    await page
      .locator(`[href*="${gameId}"]`)
      .click();

    // think about reasonable timeout
    // https://playwright.dev/docs/test-assertions#expectpoll
    await expect.poll(() => connected).toBeTruthy();
  });

  test('leaving game page disconnects only leaver', async ({ page }) => {
    let connected = false;
    page.on('websocket', ws => {
      ws.on('close', () => {
        connected = true;
      });
    })
    let connectedA = false;
    pageA.on('websocket', ws => {
      ws.on('close', () => {
        connectedA = true;
      });
    })
    await page.goto('/play');
      await page
      .locator(`[href*="${gameId}"]`)
      .click();
    
    // wait for redirect to game page (sayHi)
    await page.getByText('sayHi');

    await page.goto('/play');

    expect(connected).toBeTruthy();
    // the other player doesn't disconnect
    expect(connectedA).toBeFalsy();
  });


});
