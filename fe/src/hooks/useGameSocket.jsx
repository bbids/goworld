import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logger from '../utils/logger';

const useGameSocket = (gameId) => {
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
      setSocket(null);
      connected.current = false;
      logger.dev('Connection closed');
      navigate('/');
    };

    newSocket.onerror = () => {
      newSocket.close();
      navigate('/');
    };

    return () => {
      if (socket)
      {
        socket.close(1001);
      }
    };

  }, [socket, gameId, navigate]);
  return socket;
};


export {
  useGameSocket
};