const WebSocket = require("ws");
const logger = require("./logger");
const handleEvent = require("../events/handleEvents");

const { v4: uuidv4 } = require('uuid');

const { WSS } = require('./cache');

/**
 * Creates a WebSocket for a new game
 * @param {String} gameId 
 */
const createGameWebSocket = (gameId) => {
  // noServer options: for manual upgrade handle
  const wss = new WebSocket.WebSocketServer({ noServer: true });
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
      WSS[gameId].gameData.count -= 1;
      if (WSS[gameId].gameData.count <= 0) cleanup(gameId);
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

  WSS[gameId] = {
    server: wss,
    gameData: {
      gameId,
      count: 0,
      status: 'WAITING',
      readyCount: 0,
    },
    players: []
  }

  // const sizeof = require('object-sizeof');
  // logger.dev('COST: WSS', sizeof(WSS));
};

const cleanup = (gameId) => {
  logger.dev('Closing WebSocket');
  delete WSS[gameId];
}

module.exports = {
  createGameWebSocket
}