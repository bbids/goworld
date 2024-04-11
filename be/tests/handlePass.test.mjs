import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import handlePass from '../events/handlers/handlePass.mjs';

import { WSS } from '../utils/cache.mjs';

const gameId = '1111';

vi.mock('../utils/cache', () => {
  return {
    WSS: {
      '1111': {
        wsServer: {
          clients: [],
          forEach(callback) {
            this.clients.forEach(callback);
          }
        },
        playersUUID: [0, 1],
        gameData: {
          playerTurn: 0,
        },
      }
    }
  };
});

describe('handlePass', () => {
  beforeEach(() => {
    WSS[gameId].gameData = { playerTurn: 0 };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('on valid pass', () => {
    it('return true', () => {
      // setup
      const ws = { uuid: 0 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      const result = handlePass({ ws, gameId });

      expect(result).toEqual(true);
    });

    it('broadcasts correctly', () => {
      // setup
      const ws = { uuid: 0 };

      const receipt = { msg: null };
      const clientSend = vi.fn(msg => receipt.msg = msg);

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      handlePass({ ws, gameId });

      expect(receipt.msg).not.toBeNull();

      const result = JSON.parse(receipt.msg);
      expect(result).toStrictEqual({
        type: 'EVENT',
        eventName: 'PASS',
        mutation: {
          playerTurn: 1
        }
      });
    });
  });

  describe('on invalid pass', () => {
    it('fails if it is not a player', () => {
      // setup
      const ws = { uuid: '1421421' };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      const result = handlePass({ ws, gameId });

      expect(result).toEqual(false);
    });

    it('fails if it is not the player\' move', () => {
      // setup
      const ws = { uuid: 1 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      const result = handlePass({ ws, gameId });

      expect(result).toEqual(false);
    });
  });

});