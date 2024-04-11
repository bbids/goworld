import { WSS } from '../../utils/cache.mjs';

const handleEndGame = ({ gameId }) => {
  const { wsServer, gameData } = WSS[gameId];
  gameData.status = 'GAME_OVER';
  wsServer.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'GAME_OVER',
      mutation: {
        status: gameData.status
      }
    }));
  });
};

export default handleEndGame;