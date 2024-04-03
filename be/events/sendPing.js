const sendPing = (wss) => {
  return setInterval(() => {
    wss.clients.forEach((ws) => {
      // for now terminate, otherwise a mechanism for recovery
      if (ws.isAlive === false)
        return ws.terminate();

      ws.isAlive = false;
      ws.send(JSON.stringify({ type: 'PING' }));
    });
  }, 30000);
};

module.exports = sendPing;