import { WSS } from '../utils/cache.mjs';
import logger from '../utils/logger.mjs';
import handleMessage from './handlerImplementations/handleMessage.mjs';
import handleMoveRequest from './handlerImplementations/handleMoveRequest.mjs';
import handlePass from './handlerImplementations/handlePass.mjs';

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
  gameData.playerTurn = 0;
  gameData.blackPlayer = 0;
  gameData.whitePlayer = 1;

  const dataToSend = {
    type: 'EVENT',
    eventName: 'GAME_START',
    mutation: gameData
  };

  wsServer.clients.forEach(client => {
    if (client.uuid === playersUUID[0]) {
      dataToSend.color = 'black';
    } else {
      dataToSend.color = 'white';
    }
    client.send(JSON.stringify(dataToSend));
  });
};

const handlers = {
  'GAME_READY': handleGameReady,
  'MOVE_REQUEST': handleMoveRequest,
  'PASS': handlePass,
  'MESSAGE': handleMessage
};

const handleCustomEvent = ({ wsData, ws, gameId }) => {
  const handler = handlers[wsData.eventName] || handleDefault;
  handler({ wsData, ws, gameId });
};


export {
  handleCustomEvent
};
