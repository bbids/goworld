import { connection } from './connection';
import heartbeat from './heartbeat';

const getEventListeners = () => {
  // condition: custom events must occur at GAME_START or later!
  return [
    {
      listenerName: 'messages',
      eventName: 'MESSAGE',
      callback: ({ wsData }) => {

        const user = wsData.user;

        let playerId = -1;
        if (user !== 'spectator' && user !== 'server') {
          playerId = Number(user.substring(user.indexOf(',') + 1)); // either 0 or 1
        } else if (user === 'server') {
          playerId = 2; // temp.
        }


        const msgEvent = new CustomEvent('msgEvent', {
          detail: {
            message: wsData.message,
            playerId
          }
        });
        document.dispatchEvent(msgEvent);
      }
    },
    {
      listenerName: 'heartbeat',
      eventName: 'GAME_START',
      callback: ({ websocket }) => {
        heartbeat(websocket.raw);
      }
    },
    {
      listenerName: 'colorInformation',
      eventName: 'GAME_START',
      callback: ({ wsData }) => {
        const color = wsData.color;

        const colorEvent = new CustomEvent('GAME_START', {
          detail: {
            color
          }
        });
        document.dispatchEvent(colorEvent);
      }
    },
    {
      listenerName: 'endgame',
      eventName: 'GAME_OVER',
      callback: () => {
        console.warn('GAME OVER');
        connection.reset();

        const resetEvent = new CustomEvent('resetEvent');
        document.dispatchEvent(resetEvent);
      }
    }
    /*{
      listenerName: '',
      eventName: 'NEW_MOVES',
      callback: (websocket, wsData) => {
        const { newMoves } = wsData;

        Object.values(newMoves).forEach(move => {
          const newMoveName = move.type === 'REMOVE' ? 'REMOVE_STONE' : 'DRAW_STONE';
          const newMove = new CustomEvent(newMoveName, {
            detail: {
              row: move.row,
              col: move.col,
              color: move.color
            }
          });

          document.dispatchEvent(newMove);
        });
      }
    }*/
  ];
};

const subscribeToCustomEvents = () => {
  const eventListeners = getEventListeners();
  eventListeners.forEach(listener => {
    connection.addCustomEventListener(
      listener.eventName,
      (wsData) => {
        listener.callback({
          websocket: connection.websocket,
          wsData
        });
      });
  });
};

export {
  subscribeToCustomEvents
};