import logger from '../utils/logger';
import GameWebSocket from './GameWebSocket';
import { dispatchConnection } from './gameWebSocketUtils';

const connection = {
  websocket: null,
  dispatched: false,

  establish(gameId) {
    if (this.websocket) {
      logger.dev('WebSocket connection already established');
      return;
    }

    const wsUrl = `ws://localhost:3000/${gameId}`; // baseUrl using vite env
    this.websocket = new GameWebSocket(wsUrl);

    this.websocket.raw.addEventListener('close', () => {
      this.reset();
    });
  },

  reset() {
    if (this.websocket) {
      this.websocket.raw.close();
      this.websocket = null;
      this.dispatched = false;

      const resetEvent = new CustomEvent('resetEvent');
      document.dispatchEvent(resetEvent);
    }
  },

  dispatchEvent() {
    if (this.dispatched)
      return;

    this.dispatched = true;


    if (this.isOpen()) {
      dispatchConnection(this.websocket);
    } else {
      this.websocket.raw.addEventListener('open', () => {
        dispatchConnection(this.websocket);
      });
    }
  },

  addGameMutationListener() {
    this.errorCheck();
    return this.websocket.addGameMutationListener.apply(this.websocket, arguments);
  },

  addCustomEventListener() {
    this.errorCheck();
    return this.websocket.addCustomEventListener.apply(this.websocket, arguments);
  },

  removeCustomEventListener() {
    this.errorCheck();
    return this.websocket.removeCustomEventListener.apply(this.websocket, arguments);
  },

  removeAllCustomEventListeners() {
    this.errorCheck();
    return this.websocket.removeAllCustomEventListeners.apply(this.websocket, arguments);
  },

  addCustomOnceEventListener() {
    this.errorCheck();
    return this.websocket.addCustomOnceEventListener.apply(this.websocket, arguments);
  },

  send() {
    this.errorCheck();
    return this.websocket.send.apply(this.websocket, arguments);
  },

  isOpen() {
    if (!this.websocket) return false;
    return this.websocket.isOpen.apply(this.websocket, arguments);
  },

  errorCheck() {
    if (!this.websocket) {
      throw new Error('WebSocket is falsy');
    }
    if (!this.isOpen()) {
      throw new Error('WebSocket is not OPEN');
    }
  }
};

export { connection };

/*


function Connection() {
  logger.dev('ONCE');

  this.websocket = null;

  this.establish = function (gameId) {
    if (this.websocket) {
      logger.dev('WebSocket connection already established');
      return;
    }

    const wsUrl = `ws://localhost:3000/${gameId}`; // baseUrl using vite env
    this.websocket = new GameWebSocket(wsUrl);

    this.websocket.raw.addEventListener('close', () => {
      this.reset();
    });

  },

  this.reset = function () {
    if (this.websocket) {
      this.websocket.raw.close();
      this.websocket = null;
    }
  },


  this.dispatchEvent = function () {
    if (this.isOpen()) {
      dispatchConnection(this.websocket);
    } else {
      this.websocket.raw.addEventListener('open', () => {
        dispatchConnection(this.websocket);
      });
    }
  };
}

Connection.prototype.addGameMutationListener = function() {
  return this.websocket.addGameMutationListener.apply(this.websocket, arguments);
};

Connection.prototype.addCustomEventListener = function() {
  return this.websocket.addCustomEventListener.apply(this.websocket, arguments);
};

Connection.prototype.removeCustomEventListener = function() {
  return this.websocket.removeCustomEventListener.apply(this.websocket, arguments);
};

Connection.prototype.removeAllCustomEventListeners = function() {
  return this.websocket.removeAllCustomEventListeners.apply(this.websocket, arguments);
};

Connection.prototype.addCustomOnceEventListener = function() {
  return this.websocket.addCustomOnceEventListener.apply(this.websocket, arguments);
};

Connection.prototype.send = function() {
  return this.websocket.send.apply(this.websocket, arguments);
};

Connection.prototype.isOpen = function() {
  if (!this.websocket) return false;
  return this.websocket.isOpen.apply(this.websocket, arguments);
};

const connection = new Connection();

export {
  connection
};

*/