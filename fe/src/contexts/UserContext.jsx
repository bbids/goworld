import { createContext, useReducer } from 'react';

const initialState = {
  userStatus: null,
  gameId: null,
};

const userReducer = (state, action) => {
  switch (action.type)
  {
  case 'SET_USERSTATUS':
    return { ...state, userStatus: action.payload};
  case 'RESET':
    return { userStatus: null, gameId: null }; // add leaver event where gameId isn't reset?
  case 'START_QUEUE':
    return {
      gameId: action.payload.gameId,
      userStatus: 'QUEUE'
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