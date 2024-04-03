import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { useParams } from 'react-router-dom';
import useGame from '../hooks/useGame/useGame';
import { getEventListeners } from '../webSocket/customEvents';
import GameWebSocket from '../webSocket/GameWebSocket';
import logger from '../utils/logger';

/**
 * Loader checks if game is valid, if it isn't it redirects to
 * somewhere else
 */

/**
 * This route component should manage the actual
 * gameplay screen
 * @returns
 */
const Game = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const { game, gameMutationListener } = useGame();
  const gameId = useParams().gameId;

  const wsStateSetup = (websocket) => {
    wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });

    websocket.instance.addEventListener('close', () => {
      wsDispatch({ type: 'SET_WEBSOCKET', payload: null });
    });
  };

  const isGameReady = (websocket) => {
    // players & spectators both send this, but
    // server listens to players only
    websocket.instance.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'GAME_READY'
    }));
  };

  const joinGameWebSocket = () => {
    // the one who created the lobby
    if (wsState.inQueue) {
      wsDispatch({ type: 'SET_INQUEUE', payload: false });
      wsStateSetup(wsState.websocket);
      isGameReady(wsState.websocket);
      return;
    }

    if (wsState.websocket !== null
      && wsState.websocket.instance.readyState !== WebSocket.CLOSED)
      return;

    // todo: pass url using vite env
    const url = `ws://localhost:3000/${gameId}`;
    const websocket = new GameWebSocket(url);

    websocket.instance.addEventListener('open', () => {
      wsStateSetup(websocket);
      isGameReady(websocket);
    });

    websocket.instance.addEventListener('error', (err) => {
      logger.devError('WebSocket error', err);
    });
  };

  joinGameWebSocket();

  useEffect(() => {
    if (wsState.websocket?.instance.readyState !== WebSocket.OPEN)
      return;

    const subscribeToGameMutation = () => {
      wsState.websocket.addGameMutationListener(gameMutationListener);
    };

    const subscribeToCustomEvents = () => {
      const eventListeners = getEventListeners();
      eventListeners.forEach(listener => {
        wsState.websocket.addCustomEventListener(
          listener.eventName,
          () => { listener.callback(wsState.websocket); });
      });
    };

    subscribeToGameMutation();
    subscribeToCustomEvents();
  }, [wsState.websocket, gameMutationListener]);

  return (
    <div id='game'>
      <p>We need a board component. A chat perhaps as well ..</p>
      <button onClick={() => {
        if (wsState.websocket?.instance.readyState === WebSocket.OPEN)
          wsState.websocket.instance.send(JSON.stringify({
            type: 'MESSAGE',
            message: 'HI!'
          }));
      }}>sayHi</button>

      <p>We can now see status: {game?.status}</p>
    </div>
  );
};

export default Game;