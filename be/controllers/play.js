const playRouter = require('express').Router();
const logger = require('../utils/logger');
const { createGameWebSocket, gameData } = require('../utils/WebSocketUtils');

playRouter.get("/", (request, response) => {
  response.status(200).json(gameData);
});

playRouter.get("/create_game", async (request, response) => {
  // for now use uuid, can make string generator latern
  const gameId = (Math.floor(Math.random()*(1e8 - 1e6) + 1e6).toString());

  await createGameWebSocket(gameId);
  console.log(`Created game ${gameId}`)
  response.status(201).json({ gameId });   
});

module.exports = playRouter;