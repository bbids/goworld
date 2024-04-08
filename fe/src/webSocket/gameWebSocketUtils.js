import logger from '../utils/logger';
import { connection } from './connection';
import { subscribeToCustomEvents } from './customEvents';

const subscribeToGameMutation = () => {
  const listener = (mutation) => {
    if (!mutation || typeof mutation !== 'object') {
      logger.devError('Invalid mutation: mutation must be an object');
      return;
    }

    logger.dev('mutation: ', mutation);

    const mutationEvent = new CustomEvent('mutation', {
      detail: {
        mutation
      }
    });

    document.dispatchEvent(mutationEvent);
  };
  connection.addGameMutationListener(listener);
};


const dispatchConnection = (websocket) => {

  // preliminary stuff that must be done before hand
  // that is not handled by react components
  subscribeToCustomEvents(websocket);
  subscribeToGameMutation();

  const wsConnection = new CustomEvent('wsConnection', {
    detail: {
      websocket
    }
  });
  document.dispatchEvent(wsConnection);
};

export {
  dispatchConnection,
};