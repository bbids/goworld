import { useNavigate } from "react-router-dom";

import { useContext } from "react";

import gameService from '../services/game.js';
import logger from "../utils/logger.js";
import GameWebSocket from "../utils/GameWebSocket.js";
import { WebSocketContext } from "../contexts/WebSocketContext.jsx";

/**
 * Search for a game online
 * NEEDS FIXING: requirement: queue should persist even if user switches route
 * @returns
 */
const SearchGameCard = ({ searching, setSearching }) => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const navigate = useNavigate();

  const startGame = async () => {
    try {
      if (wsState.websocket !== null
        && wsState.websocket.instance.readyState !== WebSocket.CLOSED)
        return;

      const gameId = (await gameService.createGame()).gameId;
      const websocket = new GameWebSocket(`ws://localhost:3000/${gameId}`);
      wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });

      websocket.addEventListener('GAME_START', () => {
        setSearching(false);
        navigate(`/game/${gameId}`);
        // add a way to remove it!
      });

      setSearching(true);
    } catch (error) {
      logger.devError(error);
    }

    /*
    gameService
      .createGame()
      .then(data => data.gameId)
      .then(gameId => {
        const websocket = new GameWebSocket(`ws://localhost:3000/${gameId}`);
        wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });

        websocket.addEventListener('GAME_START', () => {
          navigate(`/game/${gameId}`);
          setSearching(false);
          // add a way to remove it!
        });
      })
      .catch((err) => {
        logger.dev(err);
      }); */
  };

  return (
    <>
      {searching ?
        <>
          <h1>Attempting to join game</h1>
          <button onClick={() => {
            wsState.websocket.instance.close();
            setSearching(false);
          }}>Stop</button>
        </>
        :
        <button onClick={startGame}>Play</button>
      }
      {/* <h1>Game ID: <span id="gameId">{gameId}</span></h1> */}

      {/*<button onClick={() => {
        websocket.disconnect();
        navigate('/');
      }}>Stop</button> */}

    </>
  );
};

export default SearchGameCard;