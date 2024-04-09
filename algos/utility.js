function getOppositeColor(color) {
  return color === 'B' ? 'W' : 'B';
}

function isOnBoard(row, col, board) {
  return row >= 0 && col >= 0 && row < board.length && col < board[0].length;
}

function surrounded(row, col, board) {
  const color = board[row][col];
  const oppositeColor = getOppositeColor(color);

  // left
  if (isOnBoard(row - 1, col, board) && board[row - 1][col] !== oppositeColor)
    return false;

  // right
  if (isOnBoard(row + 1, col, board) && board[row + 1][col] !== oppositeColor)
    return false;

  // right
  if (isOnBoard(row, col - 1, board) && board[row][col - 1] !== oppositeColor)
    return false;


  // right
  if (isOnBoard(row, col + 1, board) && board[row][col + 1] !== oppositeColor)
    return false;

  return true;
}

module.exports = {
  surrounded, getOppositeColor, isOnBoard
}