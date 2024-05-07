import gameService from '../services/game';

/**
 * See
 *  https://reactrouter.com/en/main/route/loader
 *
 */

const baseUrl = '/api/play';


export async function getGamesLoader() {
  const gamesData = await gameService.getGamesData();
  if (Object.keys(gamesData).length === 0
    && gamesData.constructor === Object)
    return null;

  return gamesData;
}

export async function getGameLoader({ params }) {
  const response = await fetch(`${baseUrl}/game/${params.gameId}`);
  if (response.status === 404)
    throw new Response('Game not found', { status: 404 });
  return response;
}
