import { getRemovedStones, getsCaptured } from '../../algos/removedStones.mjs';
import { getOppositeColor } from '../../algos/utility.mjs';
import { WSS } from '../utils/cache.mjs';
import logger from '../utils/logger.mjs';

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
  const color = gameData.playerTurn === 0 ? 'B' : 'W';
  const oppositeColor = getOppositeColor(color);

  // check if it is a player
  if (!playersUUID.includes(ws.uuid))
    return;

  // check if it their turn
  if (playersUUID[gameData.playerTurn] !== ws.uuid)
    return;

  // check if stone is there already
  if (gameBoard[row][col] !== 0)
    return;

  // check ko rule
  if (gameData.koRule !== null
    && `${row},${col}` === gameData.koRule)
    return;

  // 1) corners?
  // 2) placing a stone in a surrounded group with 1 hole

  // check if the move is a suicide
  const copy = structuredClone(gameBoard);
  copy[row][col] = color;
  if (getsCaptured(row, col, copy, color, new Set())
  && !getsCaptured(row - 1, col, copy, oppositeColor, new Set())
  && !getsCaptured(row + 1, col, copy, oppositeColor, new Set())
  && !getsCaptured(row, col - 1, copy, oppositeColor, new Set())
  && !getsCaptured(row, col + 1, copy, oppositeColor, new Set()))
    return;

  // move is valid!
  gameBoard[row][col] = color;

  // temporary 0
  const newMoves = [0];

  // stone removals
  const removedStonesArray = getRemovedStones(row, col, gameBoard);
  console.log('removedStones', removedStonesArray);

  // rowcol: `${row},${col}`
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

  // update the gameBoard by removing stones
  for (let i = 1; i < newMoves.length; i++) {
    const { row, col } = newMoves[i];
    gameBoard[row][col] = 0;
  }

  // add this turns move (at start so its sorted PLACE -> REMOVE)
  newMoves[0] = {
    type: 'PLACE',
    color: gameData.playerTurn === 0 ? 'BLACK' : 'WHITE',
    row,
    col
  };

  // ko rule
  if (removedStonesArray.length === 1)
    gameData.koRule = removedStonesArray[0];
  else
    gameData.koRule = null;

  // broadcast
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

const handleCustomEvent = ({ wsData, ws, gameId }) => {
  const handler = handlers[wsData.eventName] || handleDefault;
  handler({ wsData, ws, gameId });
};


export {
  handleCustomEvent, handleMoveRequest
};