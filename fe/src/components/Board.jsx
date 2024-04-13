import { useContext, useEffect, useRef, useState } from 'react';

import bstone from '../assets/bstone.png';
import wstone from '../assets/wstone.png';
import { UserContext } from '../contexts/UserContext';
import { drawBackgroundDefault, drawGrid, getRowAndCol } from '../utils/canvas';
import { connection } from '../webSocket/connection';

/*
  1) User places a stone
  2) Board freezes ???
  3) App sends the move event request to WebSocket server
  4) WebSocket server confirms the move event as legal
  5) if legal; WebSocket server broadcasts to every player and spectator the move event
  5.1) if not legal; else handle differently  (to be done later)
  6) User receives the move event
  7) App renders
  8) Board is frozen untill the other player does something ???

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
  const [dimension, setDimension] = useState();
  const [cellSize, setCellSize] = useState();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!game.boardSize) return;
    setDimension(canvasRef.current.height);
    setCellSize(canvasRef.current.height / (game.boardSize - 1));
  }, [game.boardSize]);

  useEffect(() => {
    function handleResize() {
      console.log('resizing', canvasRef.current, game.boardSize);
      console.log('window size', window.innerWidth, window.innerHeight);
      if (!canvasRef.current) return;

      if (window.innerWidth  < window.innerHeight) {
        // temporary value, 50 for margin, maybe use div width or something
        canvasRef.current.width = window.innerWidth - 50;
        canvasRef.current.height = window.innerWidth - 50;
        setDimension(window.innerWidth - 50);
        setCellSize((window.innerWidth - 50)/ (game.boardSize - 1));
      }
      else {
        if (canvasRef.current.height !== 576) {
          canvasRef.current.height = 576;
          canvasRef.current.width = 576;
          setDimension(576);
          setCellSize(576 / (game.boardSize - 1));
        }
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [game.boardSize]);

  // Preload stone images
  const [stoneImages, setStoneImages] = useState({});
  useEffect(() => {
    const blackStoneImg = new Image();
    blackStoneImg.src = bstone;
    blackStoneImg.onload = () => {
      setStoneImages(prevState => ({ ...prevState, blackStone: blackStoneImg}));
    };

    const whiteStoneImg = new Image();
    whiteStoneImg.src = wstone;
    whiteStoneImg.onload = () => {
      setStoneImages(prevState => ({ ...prevState, whiteStone: whiteStoneImg}));
    };
  }, []);


  // Move request
  useEffect(() => {
    if (user.userStatus !== 'GAME')
      return;
    if (!canvasRef.current)
      return;

    const canvas = canvasRef.current;

    const moveRequest = (event) => {
      const { row, col } = getRowAndCol(event, canvasRef, cellSize);
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
  }, [user, cellSize]);


  // Draw stone
  useEffect(() => {
    const drawStone = (event) => {
      if (!canvasRef.current)
        return;
      const { row, col, color } = event.detail;
      const ctx = canvasRef.current.getContext('2d');

      const x = col * cellSize;
      const y = row * cellSize;

      let stoneImg;
      if (color === 'BLACK')
        stoneImg = stoneImages.blackStone;
      else
        stoneImg = stoneImages.whiteStone;

      if(stoneImg) {
        ctx.drawImage(stoneImg, x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
      }
    };

    document.addEventListener('DRAW_STONE', drawStone);

    return () => {
      document.removeEventListener('DRAW_STONE', drawStone);
    };
  }, [stoneImages, cellSize]);


  // render the board
  useEffect(() => {
    if (!game.board) return;
    if (!canvasRef.current) return;
    if (!cellSize) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.reset();

    drawBackgroundDefault(canvasRef);
    drawGrid({
      canvasRef,
      boardSize: game.boardSize,
      cellSize
    });

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
  }, [game.board, game.boardSize, cellSize, dimension]);

  return (
    <div id='board'>
      <canvas data-testid='board' ref={canvasRef} width={576} height={576} />
    </div>
  );
};

export default Board;