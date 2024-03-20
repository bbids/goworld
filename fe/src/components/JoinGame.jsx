import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getSocket } from "../services/websocket.js"

/**
 * Redirect if full, else wait for opponent.
 * @returns 
 */
const JoinGame = () => {
  const [socket, setSocket] = useState(null);
  const id = useParams().id;

  useEffect(() => {
    if (!socket) {
      handleSocket(getSocket(id));
    }

    return () => {
      if (socket)
        socket.close();
    }
  }, [socket, id]);

  const handleSocket = (newSocket) => {
    if (!newSocket) return;

    switch (newSocket.readyState)
    {
      case WebSocket.CONNECTING:
        setSocket(newSocket); 
        break;
      default:
        null; // prompt game is full, redirect to spectate mode
        break;
    }
  }

  return (
    <>
      <h1>Attempting to join game ${id}</h1>

      <button onClick={() => {
        socket.send("I CLICKED IT BAAAH, I CLICKED IT!")
      }}>CLICK ME ,.,</button>

    </>
  );
};

export default JoinGame;