import { createContext, useReducer } from 'react';

const websocketState = {
  websocket: null,
  // in future can use authentication, and save it to user
  inQueue: false
};

const websocketReducer = (state, action) => {
  switch (action.type)
  {
  case 'SET_WEBSOCKET':
    return { ...state, websocket: action.payload };
  case 'SET_INQUEUE':
    return { ...state, inQueue: action.payload};
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
  WebSocketContext
};