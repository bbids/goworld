const { gameWebSockets } = require('./utils/WebSocketUtils')

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
    console.log("GAME ID: ", gameId);
    if (gameWebSockets[gameId]) {
      if (gameWebSockets[gameId].count >= 2) {
        /* Figure out how to send error code or message back */
        socket.write('xd?');
        socket.end("Game is full");
        // socket.destroy();
      }
      else {
        gameWebSockets[gameId].wss.handleUpgrade(request, socket, head, (ws) => {
          gameWebSockets[gameId].wss.emit("connection", ws, request);
          ++gameWebSockets[gameId].count;
        });
      }
    }
  });
};
