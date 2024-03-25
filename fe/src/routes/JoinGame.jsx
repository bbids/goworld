import { useNavigate, useParams } from "react-router-dom";

import { useGameSocket } from "../hooks/useGameSocket.jsx";
import { useEffect } from "react";

import logger from '../utils/logger.js';


/**
 * Game room, redirects if full, else wait for opponent.
 * @returns
 */
const JoinGame = () => {
  const gameId = useParams().id;
  const socket = useGameSocket(gameId);
  const navigate = useNavigate();
  //useHeartbeat(socket);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = async (event) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
      logger.dev('Received message:', event.data);
      const game = JSON.parse(event.data);
      if (!game)
        console.log(event.data);

      switch (game.status)
      {
      case 'PING':
        socket.send(JSON.stringify({ status: 'PONG' }));
        break;
      case 'GAME_START':
        navigate('/game');
      }
    };
  }, [socket, navigate]);

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

      <button onClick={() => {
        socket.close();
        navigate('/');
      }}>Exit</button>

    </>
  );
};

export default JoinGame;