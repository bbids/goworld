import { useLoaderData } from 'react-router-dom';
import OpenGamesList from '../components/OpenGamesList';
import SearchGameCard from '../components/SearchGameCard';
import { useState } from 'react';

/**
 * Will manage searching/creating games, spectate options, ladder
 * @returns Play.RouteComponent
 */
const Play = () => {
  const [searching, setSearching] = useState(false);
  const gamesData = useLoaderData();

  return (
    <>
      <SearchGameCard searching={searching} setSearching={setSearching} />

      <OpenGamesList gamesData={gamesData}/>
    </>
  );
};

export default Play;