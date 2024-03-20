import gameService from './game'

export async function playLoader() 
{
  const data = await gameService.get();
  console.log(data);
  return data;
}

export async function createGameLoader()
{
  const data = await gameService.createGame();
  console.log(data);
  return data;
}
