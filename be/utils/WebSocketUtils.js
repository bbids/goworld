const WebSocket = require("ws");
const logger = require("./logger");
const handleEvent = require("../events/handleEvents");

const { WSS, gameData } = require('./cache');

/**
 * Creates a WebSocket for a new game
 * @param {String} gameId 
 */
const createGameWebSocket = (gameId) => {
  // noServer options: for manual upgrade handle
  const wss = new WebSocket.WebSocketServer({ noServer: true });
  wss.on('connection', (ws) => {
    ws.isAlive = true;
    logger.dev(`A new client connected to game ${gameId}`);

    ws.on('message', (message) => {
      const wsData = JSON.parse(message);
      handleEvent(wsData, ws, gameId);
    });

    ws.on('close', () => {
      logger.dev(`Client disconnected from game ${gameId}`);
      gameData.get(gameId).count -= 1;
      if (gameData.get(gameId).count <= 0) cleanup(gameId)
    });

    ws.on('error', (err) => {
      cleanup(gameId);
      logger.devError(err);
    })
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      // for now terminate, otherwise a mechanism for recovery
      if (ws.isAlive === false) 
        return ws.terminate();

      ws.isAlive = false;
      ws.send(JSON.stringify({ type: 'PING' }));
    })
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  gameData.set(gameId, {
    gameId,
    count: 0, /* players + spectators */
    status: 'WAITING',
    readyCount: 0, /* players */
  });

  WSS.set(gameId, wss);

  const sizeof = require('object-sizeof');
  logger.dev('COST: WSS', sizeof(WSS));
};

const cleanup = (gameId) => {
  logger.dev('Closing WebSocket');
  WSS.delete(gameId);
  gameData.delete(gameId);
}

module.exports = {
  createGameWebSocket, WSS, gameData
}