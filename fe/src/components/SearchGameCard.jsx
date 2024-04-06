import { useNavigate } from 'react-router-dom';

import { useContext } from 'react';

import gameService from '../services/game.js';
import logger from '../utils/logger.js';
import GameWebSocket from '../webSocket/GameWebSocket.js';
import { WebSocketContext } from '../contexts/WebSocketContext.jsx';

/**
 * Search for a game online
 * @returns
 */
const SearchGameCard = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const navigate = useNavigate();

  const startSearching = async () => {
    try {
      const gameData = await gameService.createGame();

      const websocket = new GameWebSocket(`ws://localhost:3000/${gameData.gameId}`);

      websocket.instance.addEventListener('open', () => {
        wsDispatch({ type: 'START_QUEUE', payload: {
          websocket,
          gameId: gameData.gameId
        }});

        websocket.addCustomOnceEventListener('GAME_READY', () => {
          wsDispatch({ type: 'SET_USERSTATUS', payload: 'LOADING' });
          navigate(`/game/${gameData.gameId}`);
        });
      });

    } catch (error) {
      logger.devError(error);
    }
  };

  const stopSearching = () => {
    wsState.websocket.instance.close();
    wsDispatch({ type: 'RESET' });
  };


  return (
    <>
      {wsState.userStatus === 'QUEUE' ?
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