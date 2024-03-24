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
    if (!WSS[gameId] || !gameData[gameId]) return;

    // later remove this, and instead add roles such as player/spectator
    if (gameData[gameId].count >= 2) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.end();
      return;
    }

    WSS[gameId].handleUpgrade(request, socket, head, (ws) => {
      WSS[gameId].emit("connection", ws, request);
      ++gameData[gameId].count;

      // have the players, start the game
      if (gameData[gameId].count == 2)
      {
        gameData[gameId].status = "GAME_START";
        WSS[gameId].clients.forEach(client => {
          client.send(JSON.stringify(gameData[gameId]));
        });
      }
    });
  });

};