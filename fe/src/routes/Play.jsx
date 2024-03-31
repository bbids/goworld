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
     * (for now) remove game room that was created
     * by the local user
     * (later) more options to choose from
     * @param {Object} gamesData
     * @returns
     */
    const filterGamesData = (gamesData) => {
      if (!wsState.game) return gamesData;
      const filteredData = {};
      for (const gameId in gamesData) {
        if (gameId !== wsState.game.gameId) {
          // todo: fix gamesData (maybe) to not use string gameId as key
          Object.defineProperty(filteredData, gameId, gamesData[gameId]);
        }
      }
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
    <>
      <SearchGameCard />

      <OpenGamesList gamesData={gamesData} />
    </>
  );
};

export default Play;