import { useNavigate } from 'react-router-dom';
import { useContext, useRef } from 'react';

import gameService from '../../services/game.js';
import logger from '../../utils/logger.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import { connection } from '../../webSocket/connection.js';

import { searchCard, button, searching } from './SearchGameCard.module.css';
import SearchForm from './SearchForm.jsx';

/**
 * Search for a game online
 * @returns
 */
const SearchGameCard = () => {
  const { user, setUser } = useContext(UserContext);
  const selectedBoardSizeRef = useRef(19);
  const navigate = useNavigate();

  const startSearching = async (event) => {
    event.preventDefault();

    try {
      const gameData = await gameService.createGame(selectedBoardSizeRef.current);

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

  return (
    <div className={searchCard}>
      {user.userStatus === 'QUEUE' ?
        <div className={searching}>
          <p>Attempting to join game</p>
          <p>ID: {user.gameId}</p>
          { /* <a href={`http://localhost:5173/game/${user.gameId}`}>Link</a> */ }
          <button className={button}>Copy</button>
          <button
            onClick={stopSearching}
            className={button}
          >Stop</button>
        </div>
        :
        <SearchForm
          startSearching={startSearching}
          selectedBoardSizeRef={selectedBoardSizeRef}
        />
      }
    </div>
  );
};

export default SearchGameCard;