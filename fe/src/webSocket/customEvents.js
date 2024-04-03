import heartbeat from './heartbeat';

const getEventListeners = () => {
  // condition: custom events must occur at GAME_START or later!
  return [
    {
      listenerName: 'heartbeat',
      eventName: 'GAME_START',
      callback: (websocket) => {
        heartbeat(websocket.instance);
      }
    },
  ];
};

export {
  getEventListeners
};