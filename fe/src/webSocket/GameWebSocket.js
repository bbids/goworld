import logger from '../utils/logger';
import heartbeat from './heartbeat';

/**
 * Wrapper for WebSocket with custom events.
 * @param {String} wsUrl
 * @returns {GameWebSocket}
 */
function GameWebSocket(wsUrl) {
  const _eventListeners = {};
  const _onceEventListeners = new Set();
  let _handleMutation = () => { };

  this.raw = new WebSocket(wsUrl);

  this.raw.addEventListener('open', () => {
    logger.dev('Connected to WebSocket Server');
  });

  this.raw.addEventListener('close', () => {
    logger.dev('Closed connection to WebSocket Server');
  });

  this.raw.addEventListener('error', (error) => {
    this.raw.close();
    logger.devError(error);
  });

  this.raw.onmessage = (event) => {
    const wsData = JSON.parse(event.data);
    _handleEvent(wsData);
  };

  const _handleCustomEvent = (wsData) => {
    Object.keys(_eventListeners).forEach(eventName => {
      if (wsData.eventName === eventName) {
        _eventListeners[eventName].forEach(callback => {
          callback(wsData);
        });
      }
    });
  };

  const _handleCustomOnceEvent = (wsData) => {
    _onceEventListeners.forEach((listener) => {
      listener(wsData);
    });
  };

  const _handlePing = () => {
    this.raw.send(JSON.stringify({ type: 'PONG' }));
  };

  const _handleSpectator = () => {
    heartbeat(this.raw);
    logger.dev('You are a spectator.');
  };

  const _handleMessage = (wsData) => {
    logger.dev(wsData.message);
  };

  const _handleDefault = () => {
    logger.dev('Unknown wsData type');
  };

  const _handlers = {
    'EVENT': (wsData) => {
      _handleCustomEvent(wsData);
      _handleCustomOnceEvent(wsData);
    },
    'PING': _handlePing,
    'SPECTATOR': _handleSpectator,
    'MESSAGE': _handleMessage
  };

  const _handleEvent = (wsData) => {
    const handler = _handlers[wsData.type] || _handleDefault;
    if (wsData.mutation) {
      _handleMutation(wsData.mutation);
      logger.devMutation(wsData.type, wsData);
    }
    handler(wsData);

  };

  /**
 * @param {string} eventName custom event
 * @param {customEventListener} callback
 *
 * @callback customEventListener
 * @param {customEventListener} eventData ws messages may contain data property
 */
  this.addCustomEventListener = function (eventName, callback) {
    if (!_eventListeners[eventName])
      _eventListeners[eventName] = [];

    _eventListeners[eventName].push(callback);
  };


  this.removeCustomEventListener = function (eventName, callback) {
    Object.keys(_eventListeners).forEach(keyEventName => {
      if (keyEventName === eventName) {
        _eventListeners[eventName] = _eventListeners[eventName].filter(
          valueCallback => callback != valueCallback
        );
      }
    });
  };

  this.removeAllCustomEventListeners = function () {
    Object.keys(_eventListeners).forEach(key => {
      delete _eventListeners[key];
    });
  };


  /**
   * @param {string} eventName custom event
   * @param {customOnceEventListener} callback
   *
   * @callback customOnceEventListener
   * @param {customOnceEventListener} eventData ws messages may contain data property
   */
  this.addCustomOnceEventListener = function (eventName, callback) {
    const listener = (wsData) => {
      if (wsData.eventName === eventName) {
        callback(wsData.data);
        _onceEventListeners.delete(listener);
      }
    };

    _onceEventListeners.add(listener);
  };

  /**
   * Websocket messages include mutation property
   * that define properties that mutate the game state
   * by adding a new property or changing an existing one.
   * Use this method with a callback that
   * listens to those mutations.
   * @param {mutationListener} callback
   *
   * @callback mutationListener
   * @param {mutationListener} mutationData subset of game state
   * object that represents mutations
   */
  this.addGameMutationListener = function (callback) {
    if (typeof callback === 'function') {
      _handleMutation = callback;
    } else {
      throw new Error('Callback must be a function');
    }
  };

  this.send = function (msg) {
    this.raw.send(msg);
  };

  this.isOpen = function () {
    return this.raw.readyState === WebSocket.OPEN;
  };

  return this;

}

export default GameWebSocket;