import { getEventListeners } from './customEvents_pending';

const subscribeToCustomEvents = (event) => {
  const websocket = event.detail.websocket;
  const eventListeners = getEventListeners();
  eventListeners.forEach(listener => {
    websocket.addCustomEventListener(
      listener.eventName,
      () => { listener.callback(websocket); });
  });
};

document.addEventListener('wsInit', subscribeToCustomEvents);

export default subscribeToCustomEvents;