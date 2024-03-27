import { useLoaderData } from 'react-router-dom';
import OpenGamesList from '../components/OpenGamesList';
import SearchGameCard from '../components/SearchGameCard';

/**
 * Will manage searching/creating games, spectate options, ladder
 * @returns Play.RouteComponent
 */
const Play = () => {
  const gamesData = useLoaderData();

  return (
    <>
      <SearchGameCard />

      <OpenGamesList gamesData={gamesData}/>
    </>
  );
};

export default Play;