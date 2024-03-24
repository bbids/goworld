const WebSocket = require("ws");
const logger = require("./logger");

/**
 * Stores WebSocketServer as well as player count based on gameId
 */
const WSS = new Map();

/**
 * Stores game jsons containing game properties
 */
const gameData = new Map();

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
      const game = JSON.parse(message);

      if (game.status === 'PONG')
      {
        ws.isAlive = true;
        return;
      }

      // For now send message to everyone except sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString())
        }
      });
    });

    ws.on('close', () => {
      logger.dev(`Client disconnected from game ${gameId}`);
      gameData[gameId].count -= 1;
      if (gameData[gameId].count <= 0) cleanup(gameId)
    });

    ws.on('error', (err) => {
      cleanup(gameId);
      logger.devError(err);
    })
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      // for now terminate, otherwise a mechanism for recovery
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.send(JSON.stringify({ status: 'PING' }));
    })
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  gameData[gameId] = {
    gameId,
    count: 0,
    status: 'WAITING'
  }

  WSS[gameId] = wss;
};

const cleanup = (gameId) => {
  logger.dev('Closing WebSocket');
  WSS.delete(gameId);
  gameData.delete(gameId);
}

module.exports = {
  createGameWebSocket, WSS, gameData
}