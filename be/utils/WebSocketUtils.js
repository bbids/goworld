const WebSocket = require("ws");

/**
 * Stores WebSockets as well as player count based on gameId
 */
const gameWebSockets = new Map();

/**
 * Creates a WebSocket for a new game
 * @param {int} gameId 
 * @param {Map} gameWebSockets 
 */
const createGameWebSocket = (gameId) => {
  // noServer options: for manual upgrade handle
  const wss = new WebSocket.WebSocketServer({ noServer: true });
  wss.on('connection', (ws) => {
    console.log(`A new client connected to game ${gameId}`);

    ws.on('message', (message) => {
      // For now send message to everyone except sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      });
    });

    ws.on('close', () => {
      console.log(`Client disconnected from game ${gameId}`);
      gameWebSockets[gameId].count -= 1;
      if (gameWebSockets[gameId].count == 0)
        gameWebSockets.delete(gameId);
    });
  });

  gameWebSockets[gameId] = {
    wss,
    count: 0
  };
};

module.exports = {
  createGameWebSocket, gameWebSockets
}