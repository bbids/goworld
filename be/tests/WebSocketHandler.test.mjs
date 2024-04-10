import { describe, it, expect } from 'vitest';
import WebSocket from 'ws';

import request from 'supertest';

const baseUrl = 'http://localhost:3000';

describe('WebSocket Server Upgrade Handler', () => {

  it('Client websocket gets code 400 on wrong gameId', async () => {
    const connectedPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket('ws://localhost:3000/21213');

      ws.on('error', (err) => {
        if (err.message.includes(400))
          resolve(err);
        else
          reject();
        ws.close();
      });
    });

    await expect(connectedPromise).resolves.toBeTruthy();
  });

  it('1 Client can connect to a created game', async () => {
    const response = await request(baseUrl).get('/api/play/create_game');
    const { gameId } = response.body;

    const connectedPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:3000/${gameId}`);

      ws.on('open', () => {
        resolve(true);
        // ws.close(); // Close the WebSocket connection once it's opened
      });

      ws.on('error', (error) => {
        reject(error);
        console.log('ERR: ', error);
      });
    });

    await expect(connectedPromise).resolves.toBeTruthy();
  });

  it('2 clients can connect and receive GAME_READY custom event', async () => {
    const response = await request(baseUrl).get('/api/play/create_game');
    const { gameId } = response.body;

    const connectedPromises = Promise.all([
      new Promise((resolve) => {
        const ws1 = new WebSocket(`ws://localhost:3000/${gameId}`);
        ws1.on('message', (message) => {
          const wsData = JSON.parse(message);
          if (wsData.eventName === 'GAME_READY') {
            resolve(true);
            ws1.close();
          }
        });
      }),
      new Promise((resolve) => {
        const ws2 = new WebSocket(`ws://localhost:3000/${gameId}`);
        ws2.on('message', (message) => {
          const wsData = JSON.parse(message);
          if (wsData.eventName === 'GAME_READY') {
            resolve(true);
            ws2.close();
          }
        });
      })
    ]);

    await expect(connectedPromises).resolves.toBeTruthy();

  });

  it('2 clients can send GAME_READY to receive GAME_START', async () => {
    const response = await request(baseUrl).get('/api/play/create_game');
    const { gameId } = response.body;

    const client = (resolve) => {
      const ws = new WebSocket(`ws://localhost:3000/${gameId}`);
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'EVENT',
          eventName: 'GAME_READY'
        }));
      });

      ws.on('message', (message) => {
        const wsData = JSON.parse(message);
        if (wsData.eventName === 'GAME_START') {
          resolve(true);
          ws.close();
        }
      });
    };

    const connectedPromises = Promise.all([
      new Promise(client),
      new Promise(client)
    ]);

    await expect(connectedPromises).resolves.toBeTruthy();
  });

  it('3rd and onwards clients receives spectator event', async () => {
    const response = await request(baseUrl).get('/api/play/create_game');
    const { gameId } = response.body;

    const client = (resolve) => {
      const ws = new WebSocket(`ws://localhost:3000/${gameId}`);

      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'EVENT',
          eventName: 'GAME_READY'
        }));
      });

      ws.on('message', (message) => {
        const wsData = JSON.parse(message);
        if (wsData.eventName === 'GAME_START') {
          resolve(true);
          ws.close();
        }
      });
    };

    const spectator = (resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:3000/${gameId}`);
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'EVENT',
          eventName: 'GAME_READY'
        }));
      });

      ws.on('message', (message) => {
        const wsData = JSON.parse(message);

        if (wsData.type === 'SPECTATOR') {
          resolve(true);
          ws.close();
        }

        if (wsData.type === 'GAME_READY') {
          reject(false);
          ws.close();
        }
      });
    };

    const connectedPromises = Promise.all([
      new Promise(client),
      new Promise(client),
      new Promise(spectator),
      new Promise(spectator),
      new Promise(spectator),
    ]);

    await expect(connectedPromises).resolves.toBeTruthy();
  });

});