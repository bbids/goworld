import { useContext } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";

const useGame = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);

  const gameMutationListener = (mutation) => {

    // PROBLEM:
    // not receiving mutation event on
    // the creator
    const newGame = wsState.game ? structuredClone(wsState.game) : {};

    for (const key of Object.keys(mutation)) {
      newGame[key] = mutation[key];
    }

    wsDispatch({ type: 'SET_GAME', payload: newGame });
  };

  return { game: wsState.game, gameMutationListener };
};

export default useGame;