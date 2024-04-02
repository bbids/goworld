import { useContext, useEffect } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import GameWebSocket from "../webSocket/GameWebSocket";

/**
 * Connect to WebSocket Server with custom events
 * listers and game mutation listener as defined
 * by GameWebSocket constructor.
 *
 * @param {string} gameId
 * @param {array} getEventListeners
 * @param {callback} gameMutationListener
 */
const useConnect = (gameId, getEventListeners, gameMutationListener = null) => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);

  useEffect(() => {
    if (!wsState.inQueue
      && wsState.websocket !== null
      && wsState.websocket.instance.readyState !== WebSocket.CLOSED)
      return;

    const playerOpen = (websocket) => {
      // save to state
      wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });

      // game changes
      if (gameMutationListener)
        websocket.addGameMutationListener(gameMutationListener);

      // custom events
      const eventListeners = getEventListeners();
      eventListeners.forEach(listener => {
        websocket.addCustomEventListener(listener.eventName, () => { listener.callback(websocket); });
      });

      // player: game ready
      websocket.instance.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'GAME_READY'
      }));

      // cleanup state
      websocket.instance.addEventListener('close', () => {
        wsDispatch({ type: 'SET_GAME', payload: null });
      });
    };

    // the one who created the lobby need not connect

    if (wsState.inQueue) {
      wsDispatch({ type: 'SET_INQUEUE', payload: false });
      playerOpen(wsState.websocket);
      return;
    }

    const url = `ws://localhost:3000/${gameId}`;
    const websocket = new GameWebSocket(url);

    // spectators (right now) DO NOT WORK, in future add
    // a custom event listener instead of using open
    websocket.instance.addEventListener('open', () => {
      // player ->
      // spectator ->
      playerOpen(websocket);
    });

    // since we have no spectators strict mode will cause
    // a disconnect, be weary of that

  }, [wsState, wsDispatch, gameId, getEventListeners, gameMutationListener]);
};

export default useConnect;