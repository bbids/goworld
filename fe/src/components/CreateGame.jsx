import { useLoaderData } from "react-router-dom";

const CreateGame = () => {
  const game = useLoaderData();

  return (
    <>
      <h1>WHERE ARE YOU NOW ~</h1>
      <h1>Game ID: { game.game_id }</h1>
    </>
  );
};

export default CreateGame;