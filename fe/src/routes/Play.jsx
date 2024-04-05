import OpenGamesList from '../components/OpenGamesList';
import SearchGameCard from '../components/SearchGameCard';
import { useContext, useEffect, useState } from 'react';
import logger from '../utils/logger';
import gameService from '../services/game';
import { WebSocketContext } from '../contexts/WebSocketContext';

/**
 * Will manage searching/creating games, spectate options, ladder
 * @returns
 */
const Play = () => {
  const { wsState } = useContext(WebSocketContext);
  const [gamesData, setGamesData] = useState({});

  useEffect(() => {
    /**
     * @param {Object} gamesData
     * @returns
     */
    const filterGamesData = (gamesData) => {
      if (wsState.userStatus !== 'QUEUE') return gamesData;

      // for now we only remove the game which the user is in QUEUE for

      // eslint-disable-next-line no-unused-vars
      const { [wsState.gameId]: _, ...filteredData} = gamesData;
      return filteredData;
    };

    gameService
      .getGamesData()
      .then(data => {
        setGamesData(filterGamesData(data));
      })
      .catch(error => {
        logger.devError(error);
      });
  }, [wsState]);

  return (
    <div className='content'>
      <SearchGameCard />

      <OpenGamesList gamesData={gamesData} />
    </div>
  );
};

export default Play;