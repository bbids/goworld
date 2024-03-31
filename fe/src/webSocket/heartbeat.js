import logger from "../utils/logger";

/**
 * Client-side check if user is still rendering the game
 * Potential for pausing the connection, if user leaves
 * instead of directly closing the socket if game doesn't render.
 */
const heartbeat = (wsInstance) => {
  const interval = setInterval(() => {
    if (wsInstance.readyState !== WebSocket.OPEN)
    {
      clearInterval(interval);
    }
    else if (!document.getElementById('game'))
    {
      logger.dev('Client side ping verification failed. ');
      wsInstance.close();
      clearInterval(interval);
    }
  }, 5000);
};

export default heartbeat;