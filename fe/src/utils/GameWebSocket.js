import logger from "./logger";

/**
 * Out game's WebSocket Wrapper constructor.
 * @param {String} wsUrl
 * @returns {GameWebSocket}
 */
function GameWebSocket(wsUrl)
{
  let _eventListeners = [];

  this.instance = new WebSocket(wsUrl);

  this.instance.onopen = (event) => {
    logger.dev('onopen: ', event);
    logger.dev('Connected to WebSocket Server');
    this.addEventListener('GAME_START', _heartbeat);
  };

  this.instance.onclose = () => {
    logger.dev('Closed connection to WebSocket Server');
  };

  this.instance.onerror = (error) => {
    this.instance.close();
    logger.devError(error);
  };

  /**
   * type: event
   * eventName: bla
   * data: { ... }
   *
   * type: role
   * role: player/spectator
   *
   * type: status
   * connection...
   */

  this.instance.onmessage = (event) => {
    const wsData = JSON.parse(event.data);
    switch (wsData.type)
    {
    case 'EVENT':
      _eventListeners.forEach(listener => {
        listener(wsData);
      });
      break;
    case 'PING':
      this.instance.send(JSON.stringify({ type: 'PONG' }));
      break;
    case 'SPECTATOR':
      logger.dev('You are a spectator.');
      break;
    case 'MESSAGE':
      logger.dev(wsData.message);
      break;
    default:
      _eventListeners.forEach(listener => {
        listener(wsData);
      });
    }
  };

  this.addEventListener = (eventName, callback) => {
    _eventListeners.push((wsData) => {
      // check event
      if (wsData.eventName === eventName)
        callback(wsData);
    });
  };

  /**
   * Client-side check if user is still rendering the game
   * Potential for pausing the connection, if user leaves
   * instead of directly closing the socket if game doesn't render.
   */
  const _heartbeat = () => {
    const interval = setInterval(() => {
      if (this.instance.readyState !== WebSocket.OPEN)
      {
        clearInterval(interval);
      }
      else if (!document.getElementById('game'))
      {
        logger.dev('Client side ping verification failed. ');
        this.instance.close();
        clearInterval(interval);
      }
    }, 5000);
  };

  return this;
}

export default GameWebSocket;