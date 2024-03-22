import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logger from '../utils/logger';


/**
 * Use a visited flag to prevent React StrictMode and
 * other potential causes to duplicate web sockets.
 */
let connected = false;

const useSocket = (gameId) => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) return;
    connected = true;

    const newSocket = new WebSocket(`ws://localhost:3000/${gameId}`);

    newSocket.onopen = () => {
      logger.dev('Connected to WebSocket server');
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      logger.dev('Connection closed');
      setSocket(null);
      connected = false;
    };

    newSocket.onerror = () => {
      navigate('/');
      alert('Game is full.');
    };

    newSocket.onmessage = async (event) => {
      // for now a simple message exchanger
      const binaryMsg = event.data;
      const stringMsg = await binaryMsg.text();
      logger.dev('Received message:', stringMsg);
      /*
      Ideas for later:
        when an opponent arrives, broadcast game object
        whose state is game_ongoing, and from that start
        exchanging "messages" by placing stones on the board
        the game object sends appropriate information, whose
        turn is it etc.
      */
    };

    return () => {
      if (socket) socket.close();
    };

  }, [socket, gameId, navigate]);
  return socket;
};

export {
  useSocket
};