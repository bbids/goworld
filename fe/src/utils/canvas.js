
/**
 * Given a click event, return row
 * and col of a new stone on the board
 * @param {*} event
 * @param {*} canvasRef
 * @returns
 */
const getRowAndCol = (event, canvasRef, cellSize, boardEdgeSize) => {
  const canvas = canvasRef.current;

  const rect = canvas.getBoundingClientRect();
  const click_X = event.clientX - rect.left;
  const click_Y = event.clientY - rect.top;


  if (boardEdgeSize > cellSize / 2) {
    if (click_X < boardEdgeSize - cellSize / 2
      || click_X > (rect.right - rect.left - boardEdgeSize + cellSize / 2))
      return false;

    if (click_Y < boardEdgeSize - cellSize / 2
      || click_Y > (rect.bottom - rect.top - boardEdgeSize + cellSize / 2))
      return false;
  }
  const col = Math.floor((click_X + cellSize / 2 - boardEdgeSize) / cellSize);
  const row = Math.floor((click_Y + cellSize / 2 - boardEdgeSize) / cellSize);

  return { row, col };
};

const drawGrid = ({ canvasRef, boardSize, cellSize, edgeSize }) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  // vertical
  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize + edgeSize, edgeSize);
    ctx.lineTo(i * cellSize + edgeSize, cellSize * (boardSize - 1) + edgeSize);
    ctx.stroke();
    ctx.closePath();
  }

  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(edgeSize, i * cellSize + edgeSize);
    ctx.lineTo(cellSize * (boardSize - 1) + edgeSize, i * cellSize + edgeSize);
    ctx.stroke();
    ctx.closePath();
  }
};

const drawBackgroundDefault = (canvasRef) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.fillStyle = 'rgb(139, 69, 19)';
  ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  ctx.closePath();
};


export {
  getRowAndCol, drawGrid, drawBackgroundDefault
};