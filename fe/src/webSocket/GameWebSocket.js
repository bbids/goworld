import logger from '../utils/logger';
import heartbeat from './heartbeat';

/**
 * Wrapper for WebSocket with custom events.
 * @param {String} wsUrl
 * @returns {GameWebSocket}
 */
function GameWebSocket(wsUrl) {
  let _eventListeners = [];
  let _onceEventListeners = new Set();
  let _handleMutation = () => {};

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

  const _handleCustomOnceEvent = (wsData) => {
    _onceEventListeners.forEach((listener) => {
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
    handler(wsData);
    if (wsData.mutation) {
      _handleMutation(wsData.mutation);
      logger.devMutation(wsData.type, wsData);
    }
  };

  /**
   * @param {string} eventName custom event
   * @param {customEventListener} callback
   *
   * @callback customEventListener
   * @param {customEventListener} eventData ws messages may contain data property
   */
  this.addCustomEventListener = (eventName, callback) => {
    _eventListeners.push((wsData) => {
      if (wsData.eventName === eventName)
        callback(wsData.data);
    });
  };


  // rework events to use a MAP instead. consider extract event logic out.
  this.removeCustomEventListener = null;


  /**
   * @param {string} eventName custom event
   * @param {customOnceEventListener} callback
   *
   * @callback customOnceEventListener
   * @param {customOnceEventListener} eventData ws messages may contain data property
   */
  this.addCustomOnceEventListener = (eventName, callback) => {
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
  this.addGameMutationListener = (callback) => {
    if (typeof callback === 'function') {
      _handleMutation = callback;
    } else {
      throw new Error('Callback must be a function');
    }
  };

  return this;
}

export default GameWebSocket;