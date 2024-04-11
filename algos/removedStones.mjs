import { isOnBoard } from "./utility.mjs";
// TODO: testing
// TODO: union find? dp? bfs/dfs?

// check if the (row, col) stone is a part of the group that
// gets captured
function getsCaptured(row, col, board, color, visited, removedStonesArray = []) {
  if (!isOnBoard(row, col, board))
    return true;

  // if if it false where it was visited returns false there,
  // otherwise if here (row, col) is false than it returns here.
  if (visited.has(`${row},${col}`))
    return true;

  // empty = liberty
  if (board[row][col] === 0)
    return false;

  // other color = no liberty
  if (board[row][col] !== color)
    return true;

  // same color = check further on

  visited.add(`${row},${col}`);

  const left = getsCaptured(row, col - 1, board, color, visited, removedStonesArray);
  const right = getsCaptured(row, col + 1, board, color, visited, removedStonesArray);
  const up = getsCaptured(row - 1, col, board, color, visited, removedStonesArray);
  const down = getsCaptured(row + 1, col, board, color, visited, removedStonesArray);

  const check = left && right && up && down;;
  if (check)
    removedStonesArray.push(`${row},${col}`);

  return check;
}

function getRemovedStones(row, col, board) {
  const color = board[row][col];
  const oppositeColor = color === 'B' ? 'W' : 'B';

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const removedStonesArray = [];

  const visited = new Set();

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (isOnBoard(newRow, newCol, board)
      && board[newRow][newCol] === oppositeColor
      && !visited.has(`${newRow},${newCol}`)) {
      // potentially removed stones
      const prs = [];
      const isCaptured = getsCaptured(newRow, newCol, board, oppositeColor, visited, prs);

      // gets all
      if (isCaptured) {
        // removedStonesArray.push(...removeStones(newRow, newCol, board, oppositeColor));
        console.log(removedStonesArray, prs);
        removedStonesArray.push(...prs);
      }
    }
  }

  return removedStonesArray;
}

export {
  getRemovedStones, getsCaptured
}

//const board = [
//  [0, 'B', 0],
//  ['B', 'W', 'B'],
//  [0, 'B', 'W']
//]
//
//const arr = getRemovedStones(2, 1, board);
//
//console.log(arr);
//
//const board_2 = [
//  ['B', 'W'],
//  ['W', 0]
//]
//
//console.log(getRemovedStones(0, 1, board_2));
//
//const board_3 = [
//  ['W', 'B', 0, 0],
//  ['B', 'W', 'B', 'W'],
//  [0, 'B', 0, 0]
//]
//
//console.log(getRemovedStones(2, 1, board_3));
//
//const board_4 = [
//  ['B', 'W'],
//  ['B', 'W']
//]
//console.log(getRemovedStones(0, 1, board_4));
