import { useNavigate } from 'react-router-dom';

import { useContext } from 'react';

import gameService from '../services/game.js';
import logger from '../utils/logger.js';
import { UserContext } from '../contexts/UserContext.jsx';
import { connection } from '../webSocket/connection.js';

/**
 * Search for a game online
 * @returns
 */
const SearchGameCard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const startSearching = async () => {
    try {
      const gameData = await gameService.createGame();

      connection.establish(gameData.gameId);

      connection.websocket.raw.addEventListener('open', () => {
        setUser({ type: 'START_QUEUE', payload: {
          gameId: gameData.gameId
        }});

        connection.addCustomOnceEventListener('GAME_READY', () => {
          setUser({ type: 'SET_USERSTATUS', payload: 'LOADING' });
          navigate(`/game/${gameData.gameId}`);
        });
      });

    } catch (error) {
      logger.devError(error);
    }
  };

  const stopSearching = () => {
    connection.reset();
    setUser({ type: 'RESET' });
  };


  return (
    <>
      {user.userStatus === 'QUEUE' ?
        <>
          <h1>Attempting to join game</h1>
          <button onClick={stopSearching}>Stop</button>
        </>
        :
        <button onClick={startSearching}>Play</button>
      }
    </>
  );
};

export default SearchGameCard;