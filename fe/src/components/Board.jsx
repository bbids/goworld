import { useContext, useEffect, useRef } from 'react';

import bstone from '../assets/bstone.png';
import wstone from '../assets/wstone.png';
import { UserContext } from '../contexts/UserContext';
import { drawBackgroundDefault, drawGrid, getRowAndCol } from '../utils/canvas';
import { connection } from '../webSocket/connection';
import logger from '../utils/logger';

/*
  0) Board is unfrozen (out turn)
  1) User places a stone
  2) Board freezes
  3) App sends the move event request to WebSocket server
  4) WebSocket server confirms the move event as legal
  5) if legal; WebSocket server broadcasts to every player and spectator the move event
  5.1) if not legal; else handle differently  (to be done later)
  6) User receives the move event
  7) App renders necessary changes, handle win conditons etc
  8) Board is frozen untill the other player does something

  The server's move event includes an array of moves that players
  need to execute. This will incude add_stone, pass_stone, remove_stone, etc
  The players will self-inflict these events.

  Think about potentially drawing the stone before move is confirmed, and if
  error occurs, handle that later. Some kind of indicator as well possibly?
  depends on speed.

  Consider create a seperate system on the frontend for handling all of this,
  and then synchronize with React.
*/

const Board = ({ game }) => {
  const { user } = useContext(UserContext);
  const canvasRef = useRef(null);
  const cellSize = 32;

  // Move request
  useEffect(() => {
    if (user.userStatus !== 'GAME')
      return;

    const canvas = canvasRef.current;

    const moveRequest = (event) => {
      const { row, col } = getRowAndCol(event, canvasRef);

      connection.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'MOVE_REQUEST',
        row,
        col
      }));
    };

    canvas.addEventListener('click', moveRequest);

    return () => {
      canvas.removeEventListener('click', moveRequest);
    };
  }, [user]);


  // Draw stone
  useEffect(() => {
    const drawStone = (event) => {
      const { row, col, color } = event.detail;
      const ctx = canvasRef.current.getContext('2d');

      const x = col * cellSize;
      const y = row * cellSize;

      const stoneImg = new Image();
      stoneImg.src = color === 'BLACK' ? bstone : wstone;
      stoneImg.addEventListener('load', () => {
        ctx.drawImage(stoneImg, x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
      });
    };

    document.addEventListener('DRAW_STONE', drawStone);

    return () => {
      document.removeEventListener('DRAW_STONE', drawStone);
    };
  }, []);

  useEffect(() => {
    if (!game.board) return;

    // 1) Cache images
    // 2) cleanup the code

    const ctx = canvasRef.current.getContext('2d');
    ctx.reset();

    drawBackgroundDefault(canvasRef);
    drawGrid({ canvasRef, boardSize: 19, cellSize: 32});
    for(let row = 0; row < game.board.length; row++) {
      for (let col = 0; col < game.board[row].length; col++) {
        if (game.board[row][col] !== 0) {
          const ev = new CustomEvent('DRAW_STONE', {
            detail: {
              row,
              col,
              color: game.board[row][col] === 'B' ? 'BLACK' : 'WHITE'
            }
          });
          document.dispatchEvent(ev);
        }
      }
    }
  }, [game.board]);

  // Remove stone
  useEffect(() => {
    const callback = (event) => {
      const { row, col } = event.detail;
      logger.dev('removed: ', row, col);

      const ctx = canvasRef.current.getContext('2d');

      const x = col * cellSize;
      const y = row * cellSize;

      ctx.clearRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
      // ctx.clearRect(0, 0, 304, 304);
      // ctx.reset();
      // logger.dev('reset', game);
      //
      // // again state problem, IT IS TOO LATE
      //
      // drawBackgroundDefault(canvasRef);
      // drawGrid({ canvasRef, boardSize: 19, cellSize: 32});
      // for(let row = 0; row < game.board.length; row++) {
      //   for (let col = 0; col < game.board[row].length; col++) {
      //     if (game.board[row][col] !== 0) {
      //       const ev = new CustomEvent('DRAW_STONE', {
      //         detail: {
      //           row,
      //           col,
      //           color: game.board[row][col] === 'B' ? 'BLACK' : 'WHITE'
      //         }
      //       });
      //       document.dispatchEvent(ev);
      //     }
      //   }
      // }
    };

    document.addEventListener('REMOVE_STONE', callback);

    return () => {
      document.removeEventListener('REMOVE_STONE', callback);
    };
  }, [game]);

  // Board draw
  useEffect(() => {
    // todo: compute dimensions and cell size and all of that
    // default: 608x608 size, 19x19 cells, 32 cellsize
    drawBackgroundDefault(canvasRef);
    drawGrid({ canvasRef, boardSize: 19, cellSize: 32 });
  }, []);

  return (
    <>
      <canvas id='board' data-testid='board' ref={canvasRef} width={576} height={576} />
    </>
  );
};

export default Board;