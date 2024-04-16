import { Link } from 'react-router-dom';

import { openGame, join } from './OpenGameCard.module.css';

const OpenGameCard = ({ gameData }) => {
  const { gameId, status, boardSize } = gameData;

  console.log(gameData);

  return (
    <div className={openGame}>
      <p>ID: {gameId}</p>
      <p>Status: {status}</p>
      <p>{boardSize} x {boardSize}</p>
      <Link to={`/game/${gameId}`} className={join}>Join</Link>
    </div>
  );
};

export default OpenGameCard;