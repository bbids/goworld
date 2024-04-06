import logger from '../utils/logger';
import GameWebSocket from './GameWebSocket';

document.addEventListener(
  'requestConnection',
  (event) => {
    logger.dev('requestConnection', event);
    const gameId = event.detail.gameId;
    const wsUrl = `ws://localhost:3000/${gameId}`; // baseUrl using vite env
    const websocket = new GameWebSocket(wsUrl);

    websocket.instance.addEventListener('open', () => {
      dispatchConnection(websocket);
    });
  }
);

const dispatchConnection = (websocket) => {
  const wsConnection = new CustomEvent('wsConnection', {
    detail: {
      websocket
    }
  });
  document.dispatchEvent(wsConnection);
};

export {
  dispatchConnection
};