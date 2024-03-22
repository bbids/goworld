const playRouter = require('express').Router();
const WebSocketUtils = require('../utils/WebSocketUtils');

playRouter.get("/", (request, response) => {
  response.status(200).json({ "success": true });
});

playRouter.get("/create_game", async (request, response) => {
  // for now use uuid, can make string generator latern
  const gameId = (Math.floor(Math.random()*(1e8 - 1e6) + 1e6).toString());

  await WebSocketUtils.createGameWebSocket(gameId);
  console.log(`Created game ${gameId}`)
  response.status(201).json({ gameId });   
});

playRouter.get("/end_game/:id", (request, response) => {
  const game_id = request.params.id;

  const success = WebSocketUtils.gameWebSockets.delete(game_id);
  // might be unnecessary to use 404 code
  if (success)
    response.status(204);
  else
    response.status(404);
})

module.exports = playRouter;