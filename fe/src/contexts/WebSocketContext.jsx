import { createContext, useReducer } from "react";

/**
 * Still debating on what it should include. For sure
 * a websocket.
 */
const websocketState = {
  websocket: null,
  game: null
};

const websocketReducer = (state, action) => {
  switch (action.type)
  {
  case 'SET_WEBSOCKET':
    return { ...state, websocket: action.payload };
  case 'SET_GAME':
    return { ...state, game: action.payload };
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