import { WSS } from '../utils/cache.mjs';
import { handleCustomEvent } from './handleCustomEvents.mjs';
import logger from '../utils/logger.mjs';

const handleDefault = () => {
  logger.dev('handleEvents: Unknown wsData type');
};

const handlePong = ({ ws }) => {
  ws.isAlive = true;
};

const handleMessage = ({ wsData, ws, gameId }) => {
  const { wsServer } = WSS[gameId];

  wsServer.clients.forEach((client) => {
    // WebSocket.OPEN???
    if (client !== ws && client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'MESSAGE',
        message: wsData.message
      }));
    }
  });
};

const handlers = {
  'EVENT': handleCustomEvent,
  'PONG': handlePong,
  'MESSAGE': handleMessage
};

const handleEvent = (wsData, ws, gameId) => {
  const handler = handlers[wsData.type] || handleDefault;
  handler({ wsData, ws, gameId });
};


export default handleEvent;
