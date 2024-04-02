import { useState } from "react";

const useGame = () => {
  const [game, setGame] = useState({});

  const gameMutationListener = (mutation) => {
    const newGame = structuredClone(game);

    for (const key of Object.keys(mutation)) {
      newGame[key] = mutation[key];
    }

    setGame(newGame);
  };

  return { game, gameMutationListener };
};

export default useGame;