import { useContext, useEffect } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import GameWebSocket from "../utils/GameWebSocket";

/**
 * Loader checks if game is valid, if it isn't it redirects to
 * somewhere else
 */

/**
 * This route component should manage the actual
 * gameplay screen
 * @returns Game.RouteComponent
 */
const Game = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const gameId = useParams().gameId;

  useEffect(() => {
    if (wsState.websocket !== null
      && wsState.websocket.instance.readyState !== WebSocket.CLOSED)
      return;

    const url = `ws://localhost:3000/${gameId}`;
    const websocket = new GameWebSocket(url);
    wsDispatch({ type: 'SET_WEBSOCKET', payload: websocket });
  }, [wsState, wsDispatch, gameId]);

  // useEffect(() => {
  //   wsState.websocket.addEventListener('GAME_START', (wsData) => {
  //     wsDispatch({ type: 'SET_GAME', payload: wsData });
  //   });
  // }, [wsDispatch, wsState]);

  // fetch role of the player (spectator, player)


  return (
    <div id='game'>
      <p>We need a board component. A chat perhaps as well ..</p>
      <button onClick={() => {
        wsState.websocket.instance.send(JSON.stringify({
          type: 'MESSAGE',
          message: 'HI!'
        }));
      }}>sayHi</button>
    </div>
  );
};

export default Game;