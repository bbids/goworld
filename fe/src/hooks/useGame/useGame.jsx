import { useState } from 'react';
import logger from '../../utils/logger';

const useGame = () => {
  const [game, setGame] = useState({});

  const gameMutationListener = (mutation) => {
    if (!mutation || typeof mutation !== 'object') {
      logger.devError('Invalid mutation: mutation must be an object');
      return;
    }

    const newGame = { ...game, ...mutation};
    setGame(newGame);
  };

  return { game, gameMutationListener };
};

export default useGame;