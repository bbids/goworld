const { WSS, gameData } = require('../utils/cache');
const logger = require("../utils/logger");


const handleDefault = () => {
  logger.dev('handleCustomEvents: Unknown wsData type');
};

const handleGameReady = ({ gameId}) => {
  gameData.get(gameId).readyCount += 1;
  if (gameData.get(gameId).readyCount !== 2) return;

  // only players get access to GAME_START
  WSS.get(gameId).clients.forEach(client => {
    gameData.get(gameId).status = "GAME_START";
    client.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'GAME_START',
      mutation: gameData.get(gameId)
    }));
  });
};


const handlers = {
  'GAME_READY': handleGameReady,
};

/* TESTING MRAR; DISTRIBUTION MARBU */

const handleCustomEvent = ({ wsData, ws, gameId }) => {
  logger.dev('eventName: ', wsData.eventName);
  const handler = handlers[wsData.eventName] || handleDefault;
  handler({ wsData, ws, gameId });
};


module.exports = handleCustomEvent;
