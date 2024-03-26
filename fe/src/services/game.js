import logger from '../utils/logger';

const baseUrl = '/api/play';

const getGamesData = () => {
  return fetch(baseUrl)
    .then(response => {
      if (!response.ok)
        throw new Error('??? Games data unavailable', response);

      return response.json();
    })
    .then(data => data)
    .catch(error => {
      logger.devError(error);
    });
};

const createGame = () => {
  return fetch(`${baseUrl}/create_game`)
    .then(response => {
      if (!response.ok)
        throw new Error('*???');
      return response.json();
    })
    .catch(error => {
      logger.devError(error);
    });
};

const checkGameExists = (gameId) => {
  return fetch(`${baseUrl}/game/${gameId}`)
    .then(response => {
      logger.dev(response);
      if (response.status === 404)
        throw new Error(`Game not found.`);
      else if (response.status === 403)
        throw new Error('Game is full.');
      else if (!response.ok)
        throw new Error(`Game not available.`);
      return response.json();
    })
    .catch(error => {
      logger.devError(error);
    });
};

export default {
  getGamesData, createGame, checkGameExists
};