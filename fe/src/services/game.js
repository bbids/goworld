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

export default {
  getGamesData, createGame
};