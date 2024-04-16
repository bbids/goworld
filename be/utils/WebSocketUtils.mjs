import { WebSocketServer } from 'ws';
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
      const { gameData, playersUUID, wsServer } = WSS[gameId];

      gameData.count -= 1;

      console.log(playersUUID, ws.uuid);

      if (gameData.count <= 0) cleanup(gameId);

      WSS[gameId].playersUUID = playersUUID.filter(uuid => ws.uuid !== uuid);


      if (WSS[gameId].playersUUID.length === 1) {
        wsServer.clients.forEach(client => {
          console.log('sent');
          client.send(JSON.stringify({
            type: 'EVENT',
            eventName: 'MESSAGE',
            message: 'opponent disconnected',
            user: 'server'
          }));
        });
      }
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

  const gameBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

  WSS[gameId] = {
    wsServer: wss,
    gameData: {
      gameId,
      count: 0,
      status: 'WAITING',
      readyCount: 0,
      board: gameBoard,
      boardSize,
      pass: false,
      koRule: false
    },
    playersUUID: [],
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