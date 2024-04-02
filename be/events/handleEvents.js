const { WSS } = require('../utils/cache')
const handleCustomEvent = require('./handleCustomEvents');
const logger = require("../utils/logger");


const handleDefault = () => {
  logger.dev('handleEvents: Unknown wsData type');
};

const handlePong = ({ ws }) => {
  ws.isAlive = true;
};

const handleMessage = ({ wsData, ws, gameId }) => {
  WSS[gameId].server.clients.forEach((client) => {
    // WebSocket.OPEN???
    if (client !== ws && client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'MESSAGE',
        message: wsData.message
      }));
    }
  })
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


module.exports = handleEvent;
