import { Link, useLoaderData } from 'react-router-dom';
import GameInfoList from '../components/OpenGamesList';

const Play = () => {
  const gamesData = useLoaderData();

  return (
    <>
      <Link to="/create_game">create game</Link>

      <GameInfoList gamesData={gamesData}/>
    </>
  );
};

export default Play;