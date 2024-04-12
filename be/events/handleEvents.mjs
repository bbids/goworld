import { handleCustomEvent } from './handleCustomEvents.mjs';
import logger from '../utils/logger.mjs';

const handleDefault = () => {
  logger.dev('handleEvents: Unknown wsData type');
};

const handlePong = ({ ws }) => {
  ws.isAlive = true;
};

const handlers = {
  'EVENT': handleCustomEvent,
  'PONG': handlePong,
};

const handleEvent = (wsData, ws, gameId) => {
  const handler = handlers[wsData.type] || handleDefault;
  handler({ wsData, ws, gameId });
};


export default handleEvent;
