import { Link } from 'react-router-dom';

const OpenGameCard = ({ gameData }) => {
  const { gameId, status, count } = gameData;

  return (
    <div className='openGame'>
      <p>{gameId}</p>
      <p>status: {status}</p>
      <p>{count} / 2</p>
      <Link to={`/join/${gameId}`}>Join</Link>
    </div>
  );
};

export default OpenGameCard;