const { WSS } = require('./utils/cache');

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

    if (!WSS[gameId]) {
      socket.end('HTTP:/1.1 400 Bad Request');
      return;
    };

    const { gameData, wsServer, playersUUID } = WSS[gameId];

    // handle spectator mode
    if (gameData.count >= 2) {
      wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit("connection", ws, request);
        // for now increase
        gameData.count += 1;
        ws.send(JSON.stringify({ 
          type: 'SPECTATOR',
          mutation: gameData
        }));
      });
      return;
    }

    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit("connection", ws, request);
      gameData.count += 1;
      playersUUID.push(ws.uuid);

      // have the players, start the game
      if (gameData.count === 2)
      {
        gameData.status = "GAME_READY";
        wsServer.clients.forEach(client => {
          client.send(JSON.stringify({
            type: 'EVENT',
            eventName: 'GAME_READY',
          }));
        });
      }
    });
  });

};