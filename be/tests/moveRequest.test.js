import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import handleMoveRequest from '../events/handlerImplementations/handleMoveRequest.mjs';

import { WSS } from '../utils/cache.mjs';
import * as utility from '../../algos/utility.mjs';
import * as removedStones from '../../algos/removedStones.mjs';

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
          board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        },
        // gameBoard: Array.from(19, Array(19).fill(0))
        koRule: false
      }
    }
  };
});

describe('handeMoveRequest', () => {

  beforeEach(() => {
    WSS[gameId].gameData = {
      playerTurn: 0,
      board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('on valid move', () => {
    it('returns true', () => {
      // setup
      vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
      vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

      const ws = { uuid: 0 };
      const wsData = { row: 0, col: 0 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      const result = handleMoveRequest({ wsData, ws, gameId });

      // assert
      expect(result).toEqual(true);
    });

    it('should change player turn 0->1', () => {
      // setup
      vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
      vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

      const ws = { uuid: 0 };
      const wsData = { row: 0, col: 0 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      handleMoveRequest({ wsData, ws, gameId });

      // assert
      expect(WSS[gameId].gameData.playerTurn).toEqual(1);
    });

    it('should change player turn 1->0', () => {
      // setup
      vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
      vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

      WSS[gameId].gameData.playerTurn = 1;

      const ws = { uuid: 1 };
      const wsData = { row: 0, col: 0 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      handleMoveRequest({ wsData, ws, gameId });

      // assert
      expect(WSS[gameId].gameData.playerTurn).toEqual(0);
    });

    it('should call getRemovedStones', () => {
      // setup
      const isSuicide = vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
      const getRemovedStones = vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

      const ws = { uuid: 0 };
      const wsData = { row: 0, col: 0 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      handleMoveRequest({ wsData, ws, gameId });

      // assert
      expect(isSuicide).toHaveBeenCalledOnce();
      expect(getRemovedStones).toHaveBeenCalledOnce();
    });

    it('should broadcast changes', () => {
      // setup
      vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);

      vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

      const ws = { uuid: 0 };
      const wsData = { row: 0, col: 0 };

      const receive = {
        msg: null
      };
      const clientSend = vi.fn(msg => {
        receive.msg = msg;
      });

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      handleMoveRequest({ wsData, ws, gameId });

      // assert
      expect(receive.msg).not.toBeNull();
    });

    describe('should correctly update game\'s board', () => {
      it('if there are no removed stones', () => {
        // setup
        vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);

        vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

        const ws = { uuid: 0 };
        const wsData = { row: 0, col: 0 };
        const { wsServer, gameData } = WSS[gameId];

        const clientSend = vi.fn();

        wsServer.clients.push({ send: clientSend });

        // action
        handleMoveRequest({ wsData, ws, gameId });

        // assert
        expect(gameData.board).toStrictEqual([
          ['B', 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]);
      });

      it('if there is 1 removed stone', () => {
        // setup
        const { wsServer, gameData } = WSS[gameId];
        gameData.board = [
          [0, 0, 0],
          ['B', 'W', 'B'],
          [0, 'B', 0]
        ];


        vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);

        vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => ['1,1']);

        const ws = { uuid: 0 };
        const wsData = { row: 0, col: 1 };

        const clientSend = vi.fn();
        wsServer.clients.push({ send: clientSend });

        // action
        handleMoveRequest({ wsData, ws, gameId });

        // assert
        expect(gameData.board).toStrictEqual([
          [0, 'B', 0],
          ['B', 0, 'B'],
          [0, 'B', 0]
        ]);
      });

      it('if there are 3 removed stones', () => {
        // setup
        const { wsServer, gameData } = WSS[gameId];
        gameData.board = [
          ['B', 0, 'B'],
          ['W', 0, 'W'],
          ['B', 'W', 'B'],
          [0, 'B', 0]
        ];


        vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
        vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => ['2,1', '1,0', '1,2']);

        const ws = { uuid: 0 };
        const wsData = { row: 1, col: 1 };

        const clientSend = vi.fn();
        wsServer.clients.push({ send: clientSend });

        // action
        handleMoveRequest({ wsData, ws, gameId });

        // assert
        expect(gameData.board).toStrictEqual([
          ['B', 0, 'B'],
          [0, 'B', 0],
          ['B', 0, 'B'],
          [0, 'B', 0]
        ]);
      });

      it('if removing stone on double digit spot', () => {
        // setup
        const { wsServer, gameData } = WSS[gameId];
        gameData.board = Array.from({ length: 19 }, () => Array(19).fill(0));

        gameData.board [17][0] = 'B';
        gameData.board [18][0] = 'W';

        vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
        vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => ['18,0']);

        const ws = { uuid: 0 };
        const wsData = { row: 18, col: 1 };

        const clientSend = vi.fn();

        wsServer.clients.push({ send: clientSend });

        // action
        handleMoveRequest({ wsData, ws, gameId });

        // assert
        expect(gameData.board [17][0]).toEqual('B');
        expect(gameData.board [18][0]).toEqual(0);
        expect(gameData.board [18][1]).toEqual('B');
      });
    });

    describe('should correctly broadcast newMoves', () => {
      it('if there are 0 removed stones', () => {
        // setup
        vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
        vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

        const ws = { uuid: 0 };
        const wsData = { row: 0, col: 0 };

        const receive = {
          msg: null
        };
        const clientSend = vi.fn(msg => {
          receive.msg = msg;
        });

        WSS[gameId].wsServer.clients.push({ send: clientSend });

        // action
        handleMoveRequest({ wsData, ws, gameId });

        // assert
        const result = JSON.parse(receive.msg);

        expect(result.newMoves).toStrictEqual([{
          type: 'PLACE',
          color: 'BLACK',
          row: 0,
          col: 0
        }]);
      });

      it('if there is 1 removed stone', () => {
        // setup
        const { wsServer, gameData } = WSS[gameId];
        gameData.board = [
          [0, 0, 0],
          ['B', 'W', 'B'],
          [0, 'B', 0]
        ];


        vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
        vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => ['1,1']);

        const ws = { uuid: 0 };
        const wsData = { row: 0, col: 1 };

        const receive = {
          msg: null
        };
        const clientSend = vi.fn(msg => {
          receive.msg = msg;
        });
        wsServer.clients.push({ send: clientSend });

        // action
        handleMoveRequest({ wsData, ws, gameId });

        // assert
        const result = JSON.parse(receive.msg);
        expect(result.newMoves).toContainEqual({
          type: 'PLACE',
          color: 'BLACK',
          row: 0,
          col: 1
        });

        expect(result.newMoves).toContainEqual({
          type: 'REMOVE',
          row: 1,
          col: 1
        });
      });
    });
  });

  describe('returns false', () => {

    it('if it is not players turn', () => {
      vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
      vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

      const ws = { uuid: 1 };
      const wsData = { row: 0, col: 0 };

      const clientSend = vi.fn();

      WSS[gameId].wsServer.clients.push({ send: clientSend });

      // action
      const result = handleMoveRequest({ wsData, ws, gameId });

      // assert
      expect(result).toEqual(false);
    });
  });

  it('if it is not a player uuid', () => {
    vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
    vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

    const ws = { uuid: 'warnoiawrnawro' };
    const wsData = { row: 0, col: 0 };

    const clientSend = vi.fn();

    WSS[gameId].wsServer.clients.push({ send: clientSend });

    // action
    const result = handleMoveRequest({ wsData, ws, gameId });

    // assert
    expect(result).toEqual(false);
  });

  it('if it wants to place a stone on a stone', () => {
    // setup
    const { wsServer, gameData } = WSS[gameId];
    gameData.board = [
      [0, 'B'],
      [0, 0]
    ];

    vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
    vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

    const ws = { uuid: 0 };
    const wsData = { row: 0, col: 1 };

    const clientSend = vi.fn();

    wsServer.clients.push({ send: clientSend });

    // action
    const result = handleMoveRequest({ wsData, ws, gameId });

    // assert
    expect(result).toEqual(false);
  });

  it('if it breaks the ko rule', () => {
    // setup
    const { wsServer, gameData } = WSS[gameId];
    gameData.board = [
      [0, 'W', 0],
      ['W', 0, 'W'],
      ['B', 'W', 'B'],
      [0, 'B', 0]
    ];
    // previously removed: 1,1
    gameData.koRule = `${1},${1}`;

    vi.spyOn(utility, 'isSuicide').mockImplementation(() => false);
    vi.spyOn(removedStones, 'getRemovedStones').mockImplementation(() => []);

    const ws = { uuid: 0 };
    const wsData = { row: 0, col: 1 };

    const clientSend = vi.fn();

    wsServer.clients.push({ send: clientSend });

    // action
    const result = handleMoveRequest({ wsData, ws, gameId });

    // assert
    expect(result).toEqual(false);
  });
});