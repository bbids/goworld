const { WSS } = require('../utils/cache');
const logger = require('../utils/logger');


const handleDefault = () => {
  logger.dev('handleCustomEvents: Unknown wsData type');
};

const handleGameReady = ({ ws, gameId }) => {
  const { playersUUID, gameData, wsServer } = WSS[gameId];

  if (!playersUUID.includes(ws.uuid))
    return;

  // count players only
  gameData.readyCount += 1;
  if (gameData.readyCount !== 2) return;

  gameData.status = 'GAME_START';
  wsServer.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'GAME_START',
      mutation: gameData
    }));
  });
};


const handlers = {
  'GAME_READY': handleGameReady,
};

/* TESTING MRAR; DISTRIBUTION MARBU */

const handleCustomEvent = ({ wsData, ws, gameId }) => {
  const handler = handlers[wsData.eventName] || handleDefault;
  handler({ wsData, ws, gameId });
};


module.exports = handleCustomEvent;
