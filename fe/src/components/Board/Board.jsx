import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import bstone from '../../assets/bstone.png';
import wstone from '../../assets/wstone.png';
import placementAudio from '../../assets/stone_placement.wav';
import { UserContext } from '../../contexts/UserContext';
import { drawBackgroundDefault, drawGrid, getRowAndCol } from '../../utils/canvas';
import { connection } from '../../webSocket/connection';

import { lastMove, board } from './Board.module.css';

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
  const [cellSize, setCellSize] = useState();
  const [edgeSize, setBoardEdgeSize] = useState();
  const [stoneImages, setStoneImages] = useState({});
  const [audio] = useState(new Audio(placementAudio));

  const edgeFactor = useMemo(() => {
    if (!game.boardSize) return;
    return 1 / game.boardSize;
  }, [game.boardSize]);

  // Preload stone images
  useEffect(() => {
    const blackStoneImg = new Image();
    blackStoneImg.src = bstone;
    blackStoneImg.onload = () => {
      setStoneImages(prevState => ({ ...prevState, blackStone: blackStoneImg }));
    };

    const whiteStoneImg = new Image();
    whiteStoneImg.src = wstone;
    whiteStoneImg.onload = () => {
      setStoneImages(prevState => ({ ...prevState, whiteStone: whiteStoneImg }));
    };
  }, []);


  // some board properties needed for drawing
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!game.boardSize) return;

    const newEdgeSize = edgeFactor * canvasRef.current.height;
    const newCellSize = getCellSize(canvasRef.current.height, newEdgeSize, game.boardSize);
    setCellSize(newCellSize);
    setBoardEdgeSize(newEdgeSize);
  }, [game.boardSize, edgeFactor]);


  // resize / responsiveness
  useEffect(() => {
    function handleResize() {
      if (!canvasRef.current) return;

      let newHeight, newWidth;
      // TBD
      if (window.innerWidth < window.innerHeight ) {
        newHeight = newWidth = Math.floor(0.9 * window.innerWidth);
      } else if (canvasRef.current.height !== Math.floor(0.9 * window.innerHeight)) {
        newHeight = newWidth = Math.floor(0.9 * window.innerHeight);
      } else {
        return;
      }
      canvasRef.current.width = newWidth;
      canvasRef.current.height = newHeight;

      const newEdgeSize = edgeFactor * newHeight;
      const newCellSize = getCellSize(canvasRef.current.height, newEdgeSize, game.boardSize);

      setCellSize(newCellSize);
      setBoardEdgeSize(newEdgeSize);
    }

    // run immediately to set correct size
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [game.boardSize, edgeFactor]);


  // Move request
  useEffect(() => {
    if (user.userStatus !== 'GAME')
      return;
    if (!canvasRef.current)
      return;

    const canvas = canvasRef.current;

    const moveRequest = (event) => {
      const result = getRowAndCol(event, canvasRef, cellSize, edgeSize);
      if (!result) return;

      const { row, col } = result;
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
  }, [user, cellSize, edgeSize]);

  // Draw stone
  useEffect(() => {
    const drawStone = (event) => {
      if (!canvasRef.current)
        return;
      const { row, col, color } = event.detail;
      const ctx = canvasRef.current.getContext('2d');

      const x = col * cellSize + edgeSize;
      const y = row * cellSize + edgeSize;

      let stoneImg;
      if (color === 'BLACK')
        stoneImg = stoneImages.blackStone;
      else
        stoneImg = stoneImages.whiteStone;

      if (stoneImg) {
        ctx.drawImage(stoneImg, x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
      }
    };

    document.addEventListener('DRAW_STONE', drawStone);

    return () => {
      document.removeEventListener('DRAW_STONE', drawStone);
    };
  }, [stoneImages, cellSize, edgeSize, audio]);


  // render the board
  useEffect(() => {
    if (!game.board) return; // todo: check for gameData is 'received' instead
    if (!canvasRef.current) return;
    if (!cellSize) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.reset();

    drawBackgroundDefault(canvasRef);
    drawGrid({
      canvasRef,
      boardSize: game.boardSize,
      edgeSize,
      cellSize
    });

    for (let row = 0; row < game.board.length; row++) {
      for (let col = 0; col < game.board[row].length; col++) {
        if (game.board[row][col] !== 0) {
          const ev = new CustomEvent('DRAW_STONE', {
            detail: {
              row,
              col,
              color: game.board[row][col] === 'B' ? 'BLACK' : 'WHITE',
            }
          });
          document.dispatchEvent(ev);
        }
      }
    }

  }, [game.board, game.boardSize, cellSize, edgeSize]);


  // red square at the last placed stone
  useEffect(() => {
    if (!game.lastMove)
      return;

    const { row, col } = game.lastMove;

    const x = col * cellSize + edgeSize;
    const y = row * cellSize + edgeSize;

    const div = document.getElementById('lastMove');
    div.className = lastMove;
    div.style.position = 'absolute';
    div.style.height = `${cellSize / 3}px`;
    div.style.width = `${cellSize / 3}px`;
    div.style.left = `${x - cellSize / 6}px`;
    div.style.top = `${y - cellSize / 6}px`;

    audio.play();
  }, [game.lastMove, cellSize, edgeSize, audio]);

  function getCellSize(height, edgeSize, boardSize) {
    return (height - 2 * edgeSize) / (boardSize - 1);
  }

  return (
    <div id='board' className={board}>
      <div id='lastMove'></div>
      <canvas
        data-testid='board'
        ref={canvasRef}/>
    </div>
  );
};

export default Board;