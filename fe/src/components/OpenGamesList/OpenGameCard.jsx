import { Link } from 'react-router-dom';

import { openGame, join } from './OpenGameCard.module.css';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const OpenGameCard = ({ gameData }) => {
  const { user } = useContext(UserContext);
  const { gameId, status, boardSize } = gameData;

  return (
    <div className={openGame}>
      <p>ID: {gameId}</p>
      <p>Status: {status}</p>
      <p>{boardSize} x {boardSize}</p>
      {user.userStatus !== 'QUEUE' ?
        <Link to={`/game/${gameId}`} className={join}>Join</Link>
        :
        null
      }
    </div>
  );
};

export default OpenGameCard;