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

  const startGame = async () => {
    try {
      const gameData = await gameService.createGame();

      const websocket = new GameWebSocket(`ws://localhost:3000/${gameData.gameId}`);

      websocket.instance.addEventListener('open', () => {
        wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });
        wsDispatch({ type: 'SET_INQUEUE', payload: { gameId: gameData.gameId } });

        // todo: add feature for 'once only' events
        websocket.addCustomEventListener('GAME_READY', () => {
          navigate(`/game/${gameData.gameId}`);
        });
      });
    } catch (error) {
      logger.devError(error);
    }
  };

  return (
    <>
      {wsState.inQueue ?
        <>
          <h1>Attempting to join game</h1>
          <button onClick={() => {
            wsState.websocket.instance.close();
            wsDispatch({ type: 'SET_INQUEUE', payload: false });
          }}>Stop</button>
        </>
        :
        <button onClick={startGame}>Play</button>
      }
    </>
  );
};

export default SearchGameCard;