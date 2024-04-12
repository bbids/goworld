import { WebSocketServer} from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { WSS } from './cache.mjs';
import logger from './logger.mjs';

import handleEvent from '../events/handleEvents.mjs';
import sendPing from '../events/sendPing.mjs';

/**
 * Creates a WebSocket for a new game
 * @param {String} gameId
 */
const createGameWebSocket = (gameId, boardSize = 19) => {
  // noServer options: for manual upgrade handle
  const wss = new WebSocketServer({ noServer: true });
  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.uuid = uuidv4();
    logger.dev(`A new client connected to game ${gameId}`);

    ws.on('message', (message) => {
      const wsData = JSON.parse(message);
      handleEvent(wsData, ws, gameId);
    });

    ws.on('close', () => {
      logger.dev(`Client disconnected from game ${gameId}`);
      const { gameData, playersUUID } = WSS[gameId];

      gameData.count -= 1;

      WSS[gameId].playersUUID = playersUUID.filter(uuid => ws.uuid !== uuid);
      // todo: if game hasn't started yet, disconnect opponent as well

      if (gameData.count <= 0) cleanup(gameId);
    });

    ws.on('error', (err) => {
      cleanup(gameId);
      logger.devError(err);
    });
  });

  const pingInterval = sendPing(wss);

  wss.on('close', () => {
    clearInterval(pingInterval);
  });

  WSS[gameId] = {
    wsServer: wss,
    gameData: {
      gameId,
      count: 0,
      status: 'WAITING',
      readyCount: 0,
      pass: false,
      koRule: false
    },
    playersUUID: [],
    gameBoard: Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
  };

  // const sizeof = require('object-sizeof');
  // logger.dev('COST: WSS', sizeof(WSS));
};

const cleanup = (gameId) => {
  logger.dev('Closing WebSocket');
  delete WSS[gameId];
};

export {
  createGameWebSocket
};