import { WSS } from '../../utils/cache.mjs';
import handleEndGame from './handleEndGame.mjs';

const handlePass = ({ ws, gameId }) => {
  const { gameData, wsServer, playersUUID } = WSS[gameId];

  // check if it is a player
  if (!playersUUID.includes(ws.uuid))
    return false;

  // check if it their turn
  if (playersUUID[gameData.playerTurn] !== ws.uuid)
    return false;

  // valid
  // if it's a double pass, end game
  if (gameData.pass) {
    handleEndGame({ gameId });
    return;
  }
  gameData.playerTurn = (gameData.playerTurn + 1) % 2;
  gameData.pass = true;
  gameData.koRule = false;

  const msg = JSON.stringify({
    type: 'EVENT',
    eventName: 'PASS',
    mutation: {
      playerTurn: gameData.playerTurn,
      pass: gameData.pass
    }
  });
  wsServer.clients.forEach(client => {
    client.send(msg);
  });
  return true;
};

export default handlePass;