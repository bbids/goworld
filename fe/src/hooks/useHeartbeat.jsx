import { useEffect } from "react";
import logger from '../utils/logger';

/**
 * Client-side game visibility verification using Ping-Pong
 * @param {WebSocket} socket
 */
const useHeartbeat = (socket) => {
  useEffect(() => {
    if (!socket || socket.readyState === WebSocket.CLOSED) return;

    const heartbeat = () => {
      const game = document.getElementById('game');
      if (!game) {
        logger.dev('Client side ping failed');
        return false;
      }
      return true;
    };

    const interval = setInterval(() => {
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        clearInterval(interval);
      } else if (!heartbeat())
        socket.close();
    }, 5000);

  }, [socket]);
};

export default useHeartbeat;