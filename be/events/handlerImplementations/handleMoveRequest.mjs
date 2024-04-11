import { getRemovedStones } from '../../../algos/removedStones.mjs';
import { isSuicide, isSuicideNeighbour } from '../../../algos/utility.mjs';
import { WSS } from '../../utils/cache.mjs';

const handleMoveRequest = ({ wsData, ws, gameId }) => {
  const { row, col } = wsData;
  console.log('MOVE REQUEST', row, col);
  const { gameData, wsServer, playersUUID, gameBoard } = WSS[gameId];
  const color = gameData.playerTurn === 0 ? 'B' : 'W';

  // check if it is a player
  if (!playersUUID.includes(ws.uuid))
    return false;

  // check if it their turn
  if (playersUUID[gameData.playerTurn] !== ws.uuid)
    return false;

  // check if stone is there already
  if (gameBoard[row][col] !== 0)
    return false;

  // check ko rule
  if (gameData.koRule
    && `${row},${col}` === gameData.koRule)
    return false;

  // check if the move is a suicide
  const copy = structuredClone(gameBoard);
  copy[row][col] = color;
  if (isSuicide(row, col, copy, color)
  && !isSuicideNeighbour(row - 1, col, copy, color)
  && !isSuicideNeighbour(row + 1, col, copy, color)
  && !isSuicideNeighbour(row, col - 1, copy, color)
  && !isSuicideNeighbour(row, col + 1, copy, color))
    return false;

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
    gameData.koRule = false;

  // not a pass
  gameData.pass = false;

  // broadcast
  gameData.playerTurn = (gameData.playerTurn + 1) % 2;

  const msg = JSON.stringify({
    type: 'EVENT',
    eventName: 'NEW_MOVES',
    newMoves,
    mutation: {
      board: gameBoard,
      playerTurn: gameData.playerTurn,
      pass: gameData.pass
    }
  });

  wsServer.clients.forEach(client => {
    client.send(msg);
  });

  return true;
};

export default handleMoveRequest;