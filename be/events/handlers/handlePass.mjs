import { WSS } from '../../utils/cache.mjs';

const handlePass = ({ ws, gameId }) => {
  const { gameData, wsServer, playersUUID } = WSS[gameId];

  // check if it is a player
  if (!playersUUID.includes(ws.uuid))
    return false;

  // check if it their turn
  if (playersUUID[gameData.playerTurn] !== ws.uuid)
    return false;

  // valid
  gameData.playerTurn = (gameData.playerTurn + 1) % 2;

  const msg = JSON.stringify({
    type: 'EVENT',
    eventName: 'PASS',
    mutation: {
      playerTurn: gameData.playerTurn
    }
  });
  wsServer.clients.forEach(client => {
    client.send(msg);
  });
  return true;
};

export default handlePass;