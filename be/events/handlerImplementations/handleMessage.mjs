import { WSS } from '../../utils/cache.mjs';

const handleMessage = ({ ws, wsData, gameId }) => {
  const { wsServer, playersUUID } = WSS[gameId];

  console.log(wsData);

  wsServer.clients.forEach((client) => {
    // WebSocket.OPEN???
    let user;
    if (playersUUID.includes(ws.uuid)) {
      user = 'player,' + playersUUID.indexOf(ws.uuid);
    } else {
      user = 'spectator';
    }

    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'MESSAGE',
        message: wsData.message,
        user
      }));
    }
  });
};

export default handleMessage;

/**
 * MESSAGE EVENT JSON:
 *
 * message: string
 * user: the one who sent
 */