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

  this.instance.addEventListener('open', () => {
    logger.dev('Connected to WebSocket Server');
    this.addCustomEventListener('GAME_START', _heartbeat);
  });

  this.instance.addEventListener('close', () => {
    logger.dev('Closed connection to WebSocket Server');
  });

  this.instance.addEventListener('error', (error) => {
    this.instance.close();
    logger.devError(error);
  });

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
   *
   * Todo: managing game state by events
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
      /* spectator always misses the GAME_START event
        so we put GAME_START stuff here as well */
      _heartbeat();
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

  /**
   * @param {string} eventName custom event
   * @param {Function} callback
   */
  this.addCustomEventListener = (eventName, callback) => {
    _eventListeners.push((wsData) => {
      if (wsData.eventName === eventName)
        callback(wsData);
    });
  };

  return this;
}

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

export default GameWebSocket;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('test works', () => {
    expect(1).toBe(1);
  });
}