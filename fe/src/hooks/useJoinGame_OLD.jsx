import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import GameWebSocket from '../webSocket/GameWebSocket';

const useJoinGame = (gameId, getEventListeners) => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);

  useEffect(() => {
    if (wsState.websocket !== null
      && wsState.websocket.instance.readyState !== WebSocket.CLOSED)
      return;

    const url = `ws://localhost:3000/${gameId}`;
    const websocket = new GameWebSocket(url);

    const eventListeners = getEventListeners();
    eventListeners.forEach(listener => {
      websocket.addCustomEventListener(listener.eventName, listener.callback);
    });

    wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });
  }, [wsState, wsDispatch, getEventListeners, gameId]);
};

export default useJoinGame;