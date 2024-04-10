const getRemovedStones = require('../../algos/removedStones');
const { surrounded } = require('../../algos/utility');
const { WSS } = require('../utils/cache');
//import { WSS } from '../utils/cache';
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
  console.log('MOVE REQUEST', row, col);
  const { gameData, wsServer, playersUUID, gameBoard } = WSS[gameId];

  // check if it is a player
  if (!playersUUID.includes(ws.uuid))
    return;

  // check if it their turn
  if (playersUUID[gameData.playerTurn] !== ws.uuid)
    return;

  // check if the move is correct
  if (gameBoard[row][col] !== 0 || surrounded(row, col, gameBoard))
    return;

  const newMoves = [];
  // stone removals + new stone
  gameBoard[row][col] = gameData.playerTurn === 0 ? 'B' : 'W';
  const removedStonesArray = getRemovedStones(row, col, gameBoard);
  console.log('removedStones', removedStonesArray);
  for (const rowcol of removedStonesArray) {
    const seperator = rowcol.indexOf(',');
    const row = rowcol.substring(0, seperator);
    const col = rowcol.substring(seperator + 1);
    newMoves.push({
      type: 'REMOVE',
      row: Number(row),
      col: Number(col)
    });
  }

  // update the 2d moves array
  for (const move of newMoves) {
    const { row, col, type, color } = move;
    gameBoard[row][col] = type === 'PLACE' ? color[0] : 0;
  }

  newMoves.push({
    type: 'PLACE',
    color: gameData.playerTurn === 0 ? 'BLACK' : 'WHITE',
    row,
    col
  });

  // if we got this far broadcast

  gameData.playerTurn = (gameData.playerTurn + 1) % 2;

  const msg = JSON.stringify({
    type: 'EVENT',
    eventName: 'NEW_MOVES',
    newMoves,
    mutation: {
      board: gameBoard,
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


module.exports = {
  handleCustomEvent, handleMoveRequest
};
