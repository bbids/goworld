import logger from "../utils/logger";
import heartbeat from "./heartbeat";

/**
 * Wrapper for WebSocket with custom events.
 * @param {String} wsUrl
 * @returns {GameWebSocket}
 */
function GameWebSocket(wsUrl) {
  let _eventListeners = [];

  this.instance = new WebSocket(wsUrl);

  this.instance.addEventListener('open', () => {
    logger.dev('Connected to WebSocket Server');
  });

  this.instance.addEventListener('close', () => {
    logger.dev('Closed connection to WebSocket Server');
  });

  this.instance.addEventListener('error', (error) => {
    this.instance.close();
    logger.devError(error);
  });

  this.instance.onmessage = (event) => {
    const wsData = JSON.parse(event.data);
    _handleEvent(wsData);
  };

  const _handleCustomEvent = (wsData) => {
    _eventListeners.forEach(listener => {
      listener(wsData);
    });
  };

  const _handlePing = () => {
    this.instance.send(JSON.stringify({ type: 'PONG' }));
  };

  const _handleSpectator = () => {
    heartbeat(this.instance);
    logger.dev('You are a spectator.');
  };

  const _handleMessage = (wsData) => {
    logger.dev(wsData.message);
  };

  const _handleDefault = () => {
    logger.dev('Unknown wsData type');
  };

  const _handlers = {
    'EVENT': _handleCustomEvent,
    'PING': _handlePing,
    'SPECTATOR': _handleSpectator,
    'MESSAGE': _handleMessage
  };

  const _handleEvent = (wsData) => {
    const handler = _handlers[wsData.type] || _handleDefault;
    handler(wsData);
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

export default GameWebSocket;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('test works', () => {
    expect(1).toBe(1);
  });
}