import logger from '../utils/logger';

const baseUrl = '/api/play';

const getGamesData = () => {
  return fetch(baseUrl)
    .then(response => {
      if (!response.ok)
        throw new Error('Games data unavailable', response);

      return response.json();
    })
    .catch(error => {
      logger.devError(error);
    });
};

const createGame = (boardSize = 19) => {
  return (
    fetch(`${baseUrl}/create_game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        boardSize
      })
    })
      .then(response => {
        if (!response.ok)
          throw new Error('Game creation service is unavailable.');
        return response.json();
      })
      .catch(error => {
        logger.devError(error);
      })
  );
};


export default {
  getGamesData, createGame
};