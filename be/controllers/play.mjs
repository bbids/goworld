import { Router } from 'express';
import { createGameWebSocket } from '../utils/WebSocketUtils.mjs';
import { WSS } from '../utils/cache.mjs';

const playRouter = Router();

playRouter.get('/', (request, response) => {
  const games = {};

  Object.values(WSS).forEach(game => {
    games[game.gameData.gameId] = game.gameData;
  });

  response.status(200).json(games);
});

playRouter.get('/create_game', async (request, response) => {
  // for now use uuid, can make string generator latern
  const gameId = (Math.floor(Math.random()*(1e8 - 1e6) + 1e6)).toString();

  await createGameWebSocket(gameId);
  response.status(201).json(WSS[gameId].gameData);
});

playRouter.get('/game/:id', async (request, response) => {
  const gameId = request.params.id;

  if (!WSS[gameId]) {
    return response.status(404).end();
  }

  response.status(200).json(WSS[gameId].gameData);
});

export default playRouter;