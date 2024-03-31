const { test, expect, chromium } = require('@playwright/test');

/*
  WebSocket tests related to the game
*/

test.describe.configure({ mode: 'serial' });

test.describe('game websocket suite', () => {

  let pageA;
  test.beforeEach(async () => {
    const browserA = await chromium.launch();
    pageA = await browserA.newPage();
    await pageA.goto('/play');
    await pageA.getByRole('button', { name: 'Play' }).click();
  });

  test('joining an open game triggers GAME_START', async ({ page }) => {
    let connected = false;
    const frames = [];

    page.on('websocket', ws => {
      ws.on('framereceived', data => {
        const wsData = JSON.parse(data.payload);
        if (wsData.type === 'EVENT' && wsData.eventName === 'GAME_START') {
          connected = true;
        }
        frames.push(1);
      });
    });

    await page.goto('/play');
    await page.getByRole('link', { name: 'Join' }).click();

    await expect.poll(() => frames.length).toBeGreaterThan(1);

    expect(connected).toBeTruthy();
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
    await page.getByRole('link', { name: 'Join' }).click();
    
    // wait for redirect to game page (sayHi)
    await page.getByText('sayHi');

    await page.goto('/play');

    expect(connected).toBeTruthy();
    // the other player doesn't disconnect
    expect(connectedA).toBeFalsy();
  });


});
