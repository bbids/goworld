import { redirect } from 'react-router-dom';
import gameService from '../services/game';

/**
 * See
 *  https://reactrouter.com/en/main/route/loader
 *
 */


export async function getGamesLoader() {
  const gamesData = await gameService.getGamesData();
  if (Object.keys(gamesData).length === 0
      && gamesData.constructor === Object)
    return null;

  return gamesData;
}

export async function joinGameLoader({ params }) {
  const response = await gameService.checkGameExists(params.gameId);
  if (!response)
    return redirect('/play');
  return null;
}
