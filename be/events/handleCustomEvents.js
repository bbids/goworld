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
  gameData.playerTurn = 0;
  gameData.blackPlayer = 0;
  gameData.whitePlayer = 1;

  wsServer.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'GAME_START',
      mutation: gameData
    }));
  });
};

const handleMoveRequest = ({ wsData, ws, gameId }) => {
  const { row, col } = wsData;
  const { gameData, wsServer, playersUUID } = WSS[gameId];

  // check if it is a player
  if (!playersUUID.includes(ws.uuid))
    return;

  // check if it their turn
  if (playersUUID[gameData.playerTurn] !== ws.uuid)
    return;

  // check if the move is correct
  // gameData.moves blabla;

  // stone removals + new stone


  // if we got this far broadcast
  const newMoves = [
    {
      type: 'PLACE',
      color: gameData.playerTurn === 0 ? 'BLACK' : 'WHITE',
      row,
      col
    }
  ];

  gameData.playerTurn = (gameData.playerTurn + 1) % 2;
  gameData.moves = [...(gameData.moves ?? []), ...newMoves];

  const msg = JSON.stringify({
    type: 'EVENT',
    eventName: 'NEW_MOVES',
    newMoves,
    mutation: {
      moves: gameData.moves,
      playerTurn: gameData.playerTurn
    }
  });

  wsServer.clients.forEach(client => {
    client.send(msg);
  });
};


const handlers = {
  'GAME_READY': handleGameReady,
  'MOVE_REQUEST': handleMoveRequest,
};

/* TESTING MRAR; DISTRIBUTION MARBU */

const handleCustomEvent = ({ wsData, ws, gameId }) => {
  const handler = handlers[wsData.eventName] || handleDefault;
  handler({ wsData, ws, gameId });
};


module.exports = handleCustomEvent;
