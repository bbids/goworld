import { WSS } from '../../utils/cache.mjs';

const handleMessage = ({ wsData, gameId }) => {
  const { wsServer } = WSS[gameId];

  console.log(wsData);

  wsServer.clients.forEach((client) => {
    // WebSocket.OPEN???
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'MESSAGE',
        message: wsData.message
      }));
    }
  });
};

export default handleMessage;