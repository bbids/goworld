import { useParams } from "react-router-dom"

const JoinGame = () => {
  const id = useParams().id;

  // validate id: check if game is full etc

  return (
    <>
      <h1>Attempting to join game ${id}</h1>

      { /* if success link to Game*/}
    </>
  );
};

export default JoinGame;