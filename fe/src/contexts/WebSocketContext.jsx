import { createContext, useReducer } from 'react';

const websocketState = {
  websocket: null,
  userStatus: null,
  gameId: null,
};

const websocketReducer = (state, action) => {
  switch (action.type)
  {
  case 'SET_WEBSOCKET':
    return { ...state, websocket: action.payload };
  case 'SET_USERSTATUS':
    return { ...state, userStatus: action.payload};
  case 'RESET':
    return { websocket: null, userStatus: null, gameId: null }; // add leaver event where gameId isn't reset?
  case 'START_GAME':
    return {
      ...state,
      websocket: action.payload,
      userStatus: 'GAME'
    };
  case 'START_QUEUE':
    return {
      gameId: action.payload.gameId,
      websocket: action.payload.websocket,
      userStatus: 'QUEUE'
    };
  default:
    return { ...state };
  }
};

const WebSocketContext = createContext(null);

const WebSocketContextProvider = (props) => {
  const [wsState, wsDispatch] = useReducer(websocketReducer, websocketState);

  return (
    <WebSocketContext.Provider value={{wsState, wsDispatch}}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export {
  WebSocketContextProvider,
  WebSocketContext,
};