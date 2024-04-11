function getOppositeColor(color) {
  return color === 'B' ? 'W' : 'B';
}

function isOnBoard(row, col, board) {
  return row >= 0 && col >= 0 && row < board.length && col < board[0].length;
}

function isSuicide(row, col, copy, color) {
  const group = getGroup(row, col, copy, color, new Set());
  for (const stone of group) {
    const [r, c] = stone.split(',').map(Number);
    if (getLiberties(r, c, copy).size > 0) {
      return false;
    }
  }
  return true;
}

function isSuicideNeighbour(row, col, copy, centerColor) {
  if (!isOnBoard(row, col, copy)) {
    return true;
  }
  const color = copy[row][col];
  if (centerColor === color)
    return false;

  const group = getGroup(row, col, copy, color, new Set());
  for (const stone of group) {
    const [r, c] = stone.split(',').map(Number);
    if (getLiberties(r, c, copy).size > 0) {
      return false;
    }
  }
  return true;

}

function getGroup(row, col, board, color, visited) {
  const key = `${row},${col}`;
  if (visited.has(key) || board[row][col] !== color) {
    return new Set();
  }

  visited.add(key);
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let group = new Set([key]);
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isOnBoard(newRow, newCol, board)) {
      group = new Set([...group, ...getGroup(newRow, newCol, board, color, visited)]);
    }
  }
  return group;
}

function getLiberties(row, col, board) {
  const liberties = new Set();
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isOnBoard(newRow, newCol, board) && board[newRow][newCol] === 0) {
      liberties.add(`${newRow},${newCol}`)
    }
  }
  return liberties;
}


export {
  getOppositeColor,
  isOnBoard,
  isSuicide,
  isSuicideNeighbour,
  getGroup,
  getLiberties
};