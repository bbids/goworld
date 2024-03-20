import { redirect } from 'react-router-dom';
import gameService from './game'

/**
 * See
 *  https://reactrouter.com/en/main/route/loader
 * 
 */


export async function homePageLoader() 
{
  const data = await gameService.get();
  console.log(data);
  return data;
}

export async function createGameLoader()
{
  const data = await gameService.createGame();
  return redirect(`/join/${data.gameId}`);
}
