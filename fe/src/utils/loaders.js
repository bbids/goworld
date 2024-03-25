import { redirect } from 'react-router-dom';
import gameService from '../services/game';

/**
 * See
 *  https://reactrouter.com/en/main/route/loader
 *
 */


export async function createGameLoader() {
  const gameData = await gameService.createGame();
  if (!gameData)
    return redirect('/');

  return redirect(`/join/${gameData.gameId}`);
}

export async function getGamesLoader() {
  const gamesData = await gameService.getGamesData();
  if (Object.keys(gamesData).length === 0
      && gamesData.constructor === Object)
    return null;

  return gamesData;
}