const logger = require('./utils/logger');
const { WSS, gameData } = require('./utils/WebSocketUtils')

module.exports = function WebSocketHandler(server) {

  /**
   * Handle HTTP upgrade request.
   * It upgrades based on available capacity (max 2 players)
   * 
   * https://nodejs.org/docs/latest/api/events.html#emitteroneventname-listener
   * https://nodejs.org/docs/latest/api/http.html#event-upgrade_1
   * https://github.com/websockets/ws/blob/master/doc/ws.md#serverhandleupgraderequest-socket-head-callback
   */
  server.on("upgrade", (request, socket, head) => {
    const gameId = request.url.substring(1);

    // socket.end('HTTP/1.1 400 Bad Request');
    if (!WSS.has(gameId) || !gameData.has(gameId)) {
      socket.end('HTTP:/1.1 400 Bad Request');
      return;
    };

    // handle spectator mode
    if (gameData.get(gameId).count >= 2) {
      WSS.get(gameId).handleUpgrade(request, socket, head, (ws) => {
        // logger.dev(request);
        WSS.get(gameId).emit("connection", ws, request);
        ws.send(JSON.stringify({ 
          type: 'SPECTATOR',
        }));

        // for now increase
        ++gameData.get(gameId).count;
      });
      return;
    }

    WSS.get(gameId).handleUpgrade(request, socket, head, (ws) => {
      WSS.get(gameId).emit("connection", ws, request);
      ++gameData.get(gameId).count;

      // have the players, start the game
      if (gameData.get(gameId).count == 2)
      {
        gameData.get(gameId).status = "GAME_START";
        WSS.get(gameId).clients.forEach(client => {
          client.send(JSON.stringify({
            type: 'EVENT',
            eventName: 'GAME_START',
            data: gameData.get(gameId)
          }));
        });
      }
    });
  });

};