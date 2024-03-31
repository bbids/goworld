const playRouter = require('express').Router();
const logger = require('../utils/logger');
const { createGameWebSocket, gameData } = require('../utils/WebSocketUtils');

playRouter.get("/", (request, response) => {
  response.status(200).json(Object.fromEntries(gameData));
});

playRouter.get("/create_game", async (request, response) => {
  // for now use uuid, can make string generator latern
  const gameId = (Math.floor(Math.random()*(1e8 - 1e6) + 1e6)).toString();

  await createGameWebSocket(gameId);
  response.status(201).json(gameData.get(gameId));   
});

playRouter.get("/game/:id", async (request, response) => {
  const gameId = request.params.id;

  if (!gameData.has(gameId)) {
    return response.status(404).end();
  }

  response.status(200).json(gameData.get(gameId));
})

module.exports = playRouter;