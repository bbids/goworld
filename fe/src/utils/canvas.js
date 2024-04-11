
/**
 * Given a click event, return row
 * and col of a new stone on the board
 * @param {*} event
 * @param {*} canvasRef
 * @returns
 */
const getRowAndCol = (event, canvasRef, cellSize = 32) => {
  const canvas = canvasRef.current;

  const rect = canvas.getBoundingClientRect();
  const click_X = event.clientX - rect.left;
  const click_Y = event.clientY - rect.top;

  const col = Math.floor((click_X + cellSize / 2) / cellSize);
  const row = Math.floor((click_Y + cellSize / 2) / cellSize);

  return { row, col };
};

const drawGrid = ({ canvasRef, boardSize, cellSize }) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, cellSize * boardSize);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(cellSize * boardSize, i * cellSize);
    ctx.stroke();
    ctx.closePath();
  }
};

const drawBackgroundDefault = (canvasRef) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.fillStyle = 'rgb(139, 69, 19)';
  ctx.fillRect(0, 0, 608, 608);
  ctx.closePath();
};


export {
  getRowAndCol, drawGrid, drawBackgroundDefault
};