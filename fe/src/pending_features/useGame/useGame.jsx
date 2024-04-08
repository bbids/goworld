import { useState } from 'react';
import logger from '../../utils/logger';

const useGame = () => {
  const [game, setGame] = useState({});

  const gameMutationListener = (mutation) => {
    if (!mutation || typeof mutation !== 'object') {
      logger.devError('Invalid mutation: mutation must be an object');
      return;
    }

    console.log(mutation);

    setGame(pgame => {
      logger.dev('changed game', pgame, mutation);
      return ({ ...pgame, ...mutation });
    });
  };

  return { game, gameMutationListener };
};

export default useGame;