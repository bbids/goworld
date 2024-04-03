import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import GameWebSocket from '../webSocket/GameWebSocket';

/**
 * Connect to WebSocket Server
 *
 * @param {string} gameId
 */
const useConnect = (gameId) => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);

  useEffect(() => {
    if (!wsState.inQueue
      && wsState.websocket !== null
      && wsState.websocket.instance.readyState !== WebSocket.CLOSED)
      return;

    const initWebSocket = (websocket) => {
      wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });

      // players & spectators both send this, but
      // server listens to players only
      websocket.instance.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'GAME_READY'
      }));
    };

    // the one who created the lobby
    if (wsState.inQueue) {
      wsDispatch({ type: 'SET_INQUEUE', payload: false });
      initWebSocket(wsState.websocket);
      return;
    }

    const url = `ws://localhost:3000/${gameId}`;
    const websocket = new GameWebSocket(url);

    websocket.instance.addEventListener('open', () => {
      initWebSocket(websocket);
    });

    websocket.instance.addEventListener('close', () => {
      wsDispatch({ type: 'SET_WEBSOCKET', payload: null });
    });

  }, [wsState, wsDispatch, gameId]);
};

export default useConnect;