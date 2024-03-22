import { useParams } from "react-router-dom";
import logger from '../utils/logger';

const Game = () => {
  const id = useParams().id;
  logger.dev(`Àttempting to join game with id: ${id}`);

  // check if spectating or if a player ..

  return (
    <>
      <p>We need a board component. A chat perhaps as well ..</p>
    </>
  );
};

export default Game;