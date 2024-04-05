import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { useParams } from 'react-router-dom';
import useGame from '../hooks/useGame/useGame';
import { getEventListeners } from '../webSocket/customEvents';
import GameWebSocket from '../webSocket/GameWebSocket';
import logger from '../utils/logger';
import Board from '../components/Board';

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
  const url = `ws://localhost:3000/${gameId}`; // baseUrl using vite env

  useEffect(() => {
    if (wsState.userStatus === 'GAME')
      return;

    const sendGameReady = (websocket) => {
      // players & spectators both send this, but
      // server listens to players only
      websocket.instance.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'GAME_READY'
      }));
    };

    const joinGameWebSocket = () => {
      // the one who created the lobby is already (presumably) connected
      if (wsState.websocket?.instance.readyState === WebSocket.OPEN) {
        wsDispatch({ type: 'START_GAME', payload: wsState.websocket });
        sendGameReady(wsState.websocket);
        return;
      }

      const websocket = new GameWebSocket(url);
      wsDispatch({ type: 'START_GAME', payload: websocket });

      websocket.instance.addEventListener('open', () => {
        sendGameReady(websocket);
      });

      websocket.instance.addEventListener('close', () => {
        wsDispatch({ type: 'RESET' });
      });

      websocket.instance.addEventListener('error', (err) => {
        logger.devError('WebSocket error', err);
        websocket.instance.close();
      });
    };

    joinGameWebSocket();
  }, [wsDispatch, wsState, url]);

  useEffect(() => {
    if (wsState.websocket === null)
      return;

    const subscribeToCustomEvents = () => {
      const eventListeners = getEventListeners();
      eventListeners.forEach(listener => {
        wsState.websocket.addCustomEventListener(
          listener.eventName,
          () => { listener.callback(wsState.websocket); });
      });
    };

    subscribeToCustomEvents();
  }, [wsState.websocket]);

  useEffect(() => {
    if (wsState.websocket === null)
      return;

    wsState.websocket.addGameMutationListener(gameMutationListener);
  }, [wsState.websocket, gameMutationListener]);

  return (
    <div id='game' className='content'>

      <Board />

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