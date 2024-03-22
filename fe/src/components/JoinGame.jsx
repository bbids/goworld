import { useParams } from "react-router-dom";

import { useSocket } from "../hooks/useSocket.js";


/**
 * Redirect if full, else wait for opponent.
 * @returns
 */
const JoinGame = () => {
  const gameId = useParams().id;
  const socket = useSocket(gameId);

  return (
    <>
      <h1>Attempting to join game</h1>
      {socket &&
        <>
          <h1>Game ID: <span id="gameId">{gameId}</span></h1>
        </>
      }

      <button onClick={() => {
        socket && socket.send("I CLICKED IT BAAAH, I CLICKED IT!");
      }}>CLICK ME ,.,</button>

    </>
  );
};

export default JoinGame;