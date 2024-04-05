import { it, expect, describe, beforeAll, afterAll } from 'vitest';
import GameWebSocket from './GameWebSocket';
import { WebSocketServer } from 'ws';


describe('GameWebSocket test suite', () => {

  describe('customOnceEventListener suite', () => {
    let wss;
    beforeAll(() => {
      wss = new WebSocketServer({ port: 8080 });

      wss.on('connection', (ws) => {
        ws.on('message', () => {
          ws.send(JSON.stringify({
            type: 'EVENT',
            eventName: 'testPong',
            mutation: {
              fate: true
            } // same object back
          }));
        });
      });
    });

    afterAll(() => {
      wss.close();
    });

    it('is triggered once', async () => {
      const wsUrl = 'ws://localhost:8080';
      const websocket = GameWebSocket(wsUrl);

      const promise = new Promise((resolve) => {
        websocket.addCustomOnceEventListener('testPong', () => {
          resolve(true);
        });
      });

      websocket.instance.addEventListener('open', () => {
        websocket.instance.send('123');
      });
      await expect(promise).resolves.toBeTruthy();
    });

    it('is not triggered twice', async () => {
      const wsUrl = 'ws://localhost:8080';
      const websocket = GameWebSocket(wsUrl);

      let count = 0;
      websocket.addCustomOnceEventListener('testPong', () => {
        count += 1;
      });

      const promise = new Promise((resolve) => {
        let msgCount = 0;
        websocket.instance.addEventListener('open', () => {
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('4');
        });

        websocket.instance.addEventListener('message', () => {
          msgCount += 1;
          if (msgCount === 4)
            resolve(true);
        });
      });

      await expect(promise).resolves.toBeTruthy();
      await expect(count).toEqual(1);
    });

  });

  describe('addCustomEventListener suite', () => {
    let wss;
    beforeAll(() => {
      wss = new WebSocketServer({ port: 8080 });

      wss.on('connection', (ws) => {
        ws.on('message', () => {
          ws.send(JSON.stringify({
            type: 'EVENT',
            eventName: 'testPong',
            mutation: {
              fate: true
            } // same object back
          }));
        });
      });
    });

    afterAll(() => {
      wss.close();
    });

    it('is triggered once', async () => {
      const wsUrl = 'ws://localhost:8080';
      const websocket = GameWebSocket(wsUrl);

      const promise = new Promise((resolve) => {
        websocket.addCustomEventListener('testPong', () => {
          resolve(true);
        });
      });

      websocket.instance.addEventListener('open', () => {
        websocket.instance.send('123');
      });
      await expect(promise).resolves.toBeTruthy();
    });

    it('is triggered multiple times', async () => {
      const wsUrl = 'ws://localhost:8080';
      const websocket = GameWebSocket(wsUrl);

      let count = 0;
      websocket.addCustomEventListener('testPong', () => {
        count += 1;
      });

      const promise = new Promise((resolve) => {
        let msgCount = 0;
        websocket.instance.addEventListener('open', () => {
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('4');
        });

        websocket.instance.addEventListener('message', () => {
          msgCount += 1;
          if (msgCount === 4)
            resolve(true);
        });
      });

      await expect(promise).resolves.toBeTruthy();
      await expect(count).toEqual(4);
    });

  });

  describe('removeCustomEventLister', () => {
    let wss;
    beforeAll(() => {
      wss = new WebSocketServer({ port: 8080 });

      wss.on('connection', (ws) => {
        ws.on('message', () => {
          ws.send(JSON.stringify({
            type: 'EVENT',
            eventName: 'testPong',
            mutation: {
              fate: true
            } // same object back
          }));
        });
      });
    });

    afterAll(() => {
      wss.close();
    });

    it('removed callback is not triggered', async () => {
      const wsUrl = 'ws://localhost:8080';
      const websocket = GameWebSocket(wsUrl);

      let count = 0;
      const callback = () => {
        count += 1;
      };

      websocket.addCustomEventListener('testPong', callback);
      websocket.removeCustomEventListener('testPong', callback);

      const promise = new Promise((resolve) => {
        let msgCount = 0;
        websocket.instance.addEventListener('open', () => {
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('4');
        });

        websocket.instance.addEventListener('message', () => {
          msgCount += 1;
          if (msgCount === 4)
            resolve(true);
        });
      });

      await expect(promise).resolves.toBeTruthy();
      await expect(count).toEqual(0);
    });

    it('can add the removed one back', async () => {
      const wsUrl = 'ws://localhost:8080';
      const websocket = GameWebSocket(wsUrl);

      let count = 0;
      const callback = () => {
        count += 1;
      };

      websocket.addCustomEventListener('testPong', callback);
      websocket.removeCustomEventListener('testPong', callback);
      websocket.addCustomEventListener('testPong', callback);

      const promise = new Promise((resolve) => {
        let msgCount = 0;
        websocket.instance.addEventListener('open', () => {
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('123');
          websocket.instance.send('4');
        });

        websocket.instance.addEventListener('message', () => {
          msgCount += 1;
          if (msgCount === 4)
            resolve(true);
        });
      });

      await expect(promise).resolves.toBeTruthy();
      await expect(count).toEqual(4);
    });
  });
});

describe('addGameMutationListener suite', () => {
  it('is  mutates on mutation present', async () => {
    const wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', (ws) => {
      ws.on('message', () => {
        ws.send(JSON.stringify({
          type: 'EVENT',
          eventName: 'testPong',
          mutation: {
            fate: true
          } // same object back
        }));
      });
    });

    const wsUrl = 'ws://localhost:8080';
    const websocket = GameWebSocket(wsUrl);

    const promise = new Promise((resolve) => {
      websocket.addGameMutationListener((mutation) => {
        expect(mutation).toEqual({
          fate: true // see beforeall
        });
        resolve(true);
      });
    });

    websocket.instance.addEventListener('open', () => {
      websocket.instance.send('123');
    });
    await expect(promise).resolves.toBeTruthy();

    wss.close();
  });


  it('does not mutate if no mutation', async () => {
    const wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', (ws) => {
      ws.on('message', () => {
        ws.send(JSON.stringify({
          type: 'EVENT',
          eventName: 'testPong',
        }));
      });
    });

    const wsUrl = 'ws://localhost:8080';
    const websocket = GameWebSocket(wsUrl);

    const promise = new Promise((resolve, reject) => {
      let msgCount = 0;
      websocket.addGameMutationListener(() => {
        reject();
      });

      websocket.instance.addEventListener('message', () => {
        // send more msg just in case
        msgCount += 1;
        if (msgCount === 3)
          resolve(true);
      });
    });

    websocket.instance.addEventListener('open', () => {
      websocket.instance.send('123');
      websocket.instance.send('123');
      websocket.instance.send('123');
    });
    await expect(promise).resolves.toBeTruthy();
  });
});