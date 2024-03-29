import { useNavigate } from "react-router-dom";

import { useContext } from "react";

import gameService from '../services/game.js';
import logger from "../utils/logger.js";
import GameWebSocket from "../utils/GameWebSocket.js";
import { WebSocketContext } from "../contexts/WebSocketContext.jsx";

/**
 * Search for a game online
 * @returns
 */
const SearchGameCard = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const navigate = useNavigate();

  const startGame = async () => {
    gameService
      .createGame()
      .then(gameData => {
        const websocket = new GameWebSocket(`ws://localhost:3000/${gameData.gameId}`);
        wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });
        wsDispatch({ type: 'SET_GAME', payload: gameData });

        websocket.addCustomEventListener('GAME_START', (wsData) => {
          navigate(`/game/${gameData.gameId}`);
          wsDispatch({ type: 'SET_GAME', payload: wsData.data });
        });

        websocket.instance.addEventListener('close', () => {
          wsDispatch({ type: 'SET_GAME', payload: null });
        });

        // event listener for any game related changes, that would
        // automatically update the game state
      })
      .catch(error => {
        logger.devError(error);
      });
  };

  return (
    <>
      {wsState.game?.status === 'WAITING' ?
        <>
          <h1>Attempting to join game</h1>
          <button onClick={() => {
            wsState.websocket.instance.close();
            wsDispatch({ type: 'SET_GAME', payload: null });
          }}>Stop</button>
        </>
        :
        <button onClick={startGame}>Play</button>
      }
    </>
  );
};

export default SearchGameCard;