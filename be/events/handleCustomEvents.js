const { WSS } = require('../utils/cache');
const logger = require("../utils/logger");


const handleDefault = () => {
  logger.dev('handleCustomEvents: Unknown wsData type');
};

const handleGameReady = ({ gameId}) => {
  WSS[gameId].gameData.readyCount += 1;
  if (WSS[gameId].gameData.readyCount !== 2) return;

  // only players get access to GAME_START
  WSS[gameId].server.clients.forEach(client => {
    WSS[gameId].gameData.status = "GAME_START";
    client.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'GAME_START',
      mutation: WSS[gameId].gameData
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
