import { useEffect } from 'react';

const Board = () => {

  useEffect(() => {
    const canvas = document.getElementById('board');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(139, 69, 19)';
    ctx.fillRect(10, 10, 600, 600);
  }, []);

  return (
    <canvas id='board'>

    </canvas>
  );
};

export default Board;