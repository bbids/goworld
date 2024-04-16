import OpenGamesList from '../components/OpenGamesList';
import SearchGameCard from '../components/SearchGame/SearchGameCard';
import { useContext, useEffect, useState } from 'react';
import logger from '../utils/logger';
import gameService from '../services/game';
import { UserContext } from '../contexts/UserContext';

/**
 * Will manage searching/creating games, spectate options, ladder
 * @returns
 */
const Play = () => {
  const { user } = useContext(UserContext);
  const [gamesData, setGamesData] = useState({});

  useEffect(() => {
    /**
     * @param {Object} gamesData
     * @returns
     */
    const filterGamesData = (gamesData) => {
      if (user.userStatus !== 'QUEUE') return gamesData;

      // for now we only remove the game which the user is in QUEUE for

      // eslint-disable-next-line no-unused-vars
      const { [user.gameId]: _, ...filteredData} = gamesData;
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
  }, [user]);

  return (
    <div className='content'>
      <SearchGameCard />

      <OpenGamesList gamesData={gamesData} />
    </div>
  );
};

export default Play;