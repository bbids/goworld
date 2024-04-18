import { createContext, useReducer } from 'react';

const initialState = {
  userStatus: null,
  gameId: null,
  color: null
};

const userReducer = (state, action) => {
  switch (action.type)
  {
  case 'SET_USERSTATUS':
    return { ...state, userStatus: action.payload};
  case 'RESET':
    return { userStatus: null, gameId: null, color: null }; // add leaver event where gameId isn't reset?
  case 'START_QUEUE':
    return {
      ...state,
      gameId: action.payload.gameId,
      userStatus: 'QUEUE'
    };
  case 'SET_COLOR':
    return {
      ...state,
      color: action.payload
    };
  default:
    return { ...state };
  }
};

const UserContext = createContext(null);

const UserContextProvider = (props) => {
  const [user, setUser] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {props.children}
    </UserContext.Provider>
  );
};

export {
  UserContextProvider,
  UserContext,
};