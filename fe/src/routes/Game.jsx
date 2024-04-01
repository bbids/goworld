import { useContext } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import useConnect from "../hooks/useConnect";
import useGame from "../hooks/useGame";
import heartbeat from "../webSocket/heartbeat";

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
  const { wsState } = useContext(WebSocketContext);
  const gameId = useParams().gameId;
  const { game, gameMutationListener } = useGame();

  const getEventListeners = () => {
    return [
      {
        listenerName: 'heartbeat',
        eventName: 'GAME_START',
        callback: (websocket) => {
          heartbeat(websocket.instance);
        }
      }
    ];
  };

  useConnect(gameId, getEventListeners, gameMutationListener);

  return (
    <div id='game'>
      <p>We need a board component. A chat perhaps as well ..</p>
      <button onClick={() => {
        if (wsState.websocket.isOpen())
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