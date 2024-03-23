import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logger from '../utils/logger';

const useSocket = (gameId) => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // prevent strict mode from duplicating, also
  // other potential causes
  const connected = useRef(false);

  useEffect(() => {
    if (connected.current) return;
    connected.current = true;

    const newSocket = new WebSocket(`ws://localhost:3000/${gameId}`);

    newSocket.onopen = () => {
      logger.dev('Connected to WebSocket server');
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      logger.dev('Connection closed');
      setSocket(null);
      connected.current = false;
    };

    newSocket.onerror = () => {
      navigate('/');
      alert('Game is full.');
    };

    newSocket.onmessage = async (event) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
      const binaryMsg = event.data;
      const stringMsg = await binaryMsg.text();
      logger.dev('Received message:', stringMsg);
      logger.dev(event);
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