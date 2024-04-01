import { useContext } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import logger from "../utils/logger";

const useGame = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);

  const gameMutationListener = (mutation) => {

    // PROBLEM:
    // not receiving mutation event on
    // the creator
    logger.dev('mutation ', mutation);

    const newGame = wsState.game ? structuredClone(wsState.game) : {};

    for (const key of Object.keys(mutation)) {
      newGame[key] = mutation[key];
    }

    logger.dev(newGame);

    wsDispatch({ type: 'SET_GAME', payload: newGame });
  };

  return { game: wsState.game, gameMutationListener };
};

export default useGame;