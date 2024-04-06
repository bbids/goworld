import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import useGame from '../hooks/useGame/useGame';
import { useParams } from 'react-router-dom';
import { dispatchConnection } from '../webSocket/gameWebSocketUtils';
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

  // initialize after connection
  useEffect(() => {
    const initialise = (event) => {
      const websocket = event.detail.websocket;
      websocket.addGameMutationListener(gameMutationListener);
      wsDispatch({ type: 'START_GAME', payload: websocket });
      websocket.instance.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'GAME_READY'
      }));
    };

    document.addEventListener('wsConnection', initialise);

    return () => {
      document.removeEventListener('wsConnection', initialise);
    };
  }, [wsState, wsDispatch, gameMutationListener]);


  // dispatch trigger event : starting point
  useEffect(() => {
    if (wsState.userStatus === 'GAME'
      || wsState.userStatus === 'CONNECTING')
      return;

    // The one in QUEUE is already connected
    if (wsState.websocket?.instance.readyState === WebSocket.OPEN) {
      dispatchConnection(wsState.websocket);
      return;
    }

    wsDispatch({ type: 'SET_USERSTATUS', payload: 'CONNECTING' });

    const requestConnection = new CustomEvent('requestConnection', {
      detail: { gameId }
    });
    document.dispatchEvent(requestConnection);
  }, [wsState, wsDispatch, gameId]);


  return (
    <div id='game' className='content'>

      <Board />

      <p>We need a chat as well ..</p>
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