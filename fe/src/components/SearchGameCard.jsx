import { useNavigate } from 'react-router-dom';

import { useContext, useState } from 'react';

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
  const [selectedBoardSize, setSelectedBoardSize] = useState(19);
  const navigate = useNavigate();

  const startSearching = async (event) => {
    event.preventDefault();

    try {
      const gameData = await gameService.createGame(selectedBoardSize);

      connection.establish(gameData.gameId);

      connection.websocket.raw.addEventListener('open', () => {
        setUser({
          type: 'START_QUEUE', payload: {
            gameId: gameData.gameId
          }
        });

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


  const boardSizes = [9, 13, 19];
  const handleBoardSizeChange = (event) => {
    setSelectedBoardSize(Number(event.target.value));
  };

  return (
    <>
      {user.userStatus === 'QUEUE' ?
        <>
          <h1>Attempting to join game</h1>
          <button onClick={stopSearching}>Stop</button>
        </>
        :
        <form onSubmit={startSearching}>
          <p>
            <label htmlFor='selectedBoardSize'>Board size: </label>
            <select
              id="selectedBoardSize"
              value={selectedBoardSize}
              onChange={handleBoardSizeChange}
            >
              {boardSizes.map(val => {
                return <option key={val}>{val}</option>;
              })}
            </select>
          </p>
          <button type='submit'>Play</button>
        </form>
      }
    </>
  );
};

export default SearchGameCard;