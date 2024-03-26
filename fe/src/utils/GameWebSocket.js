import logger from "./logger";

/**
 * Out game's WebSocket Wrapper constructor.
 * @param {String} wsUrl
 * @returns {GameWebSocket}
 */
function GameWebSocket(wsUrl)
{
  let _messageListeners = [];

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
    _messageListeners.forEach(listener => {
      listener(wsData);
    });
    /*
    switch (wsData.type)
    {
    case 'event':
      return;
    case 'status':
      return;
    default:
      _messageListeners.forEach(listener => {
        listener(wsData);
      });
      return;
    } */
  };

  this.addEventListener = (eventName, callback) => {
    _messageListeners.push((wsData) => {
      // check event
      if (wsData.status === eventName)
        callback(wsData);
    });
  };

  /**
   * Server-Client connection verification using ping pong method
   */
  this.addEventListener('PING', () => {
    this.instance.send(JSON.stringify({ status: 'PONG' }));
  });

  /**
   * Client-side check if user is still rendering the game
   * Potential for pausing the connection, if user leaves
   * instead of directly closing the socket if game doesn't render.
   */
  const _heartbeat = () => {
    const _ping = () => {
      const game = document.getElementById('game');
      if (!game) {
        logger.dev('Client side ping verification failed. ');
        return false;
      }
      return true;
    };
    const interval = setInterval(() => {
      if (this.instance.readyState !== WebSocket.OPEN)
      {
        clearInterval(interval);
      }
      else if (!_ping())
      {
        this.instance.close();
        clearInterval(interval);
      }
    }, 5000);
  };

  return this;
}

export default GameWebSocket;