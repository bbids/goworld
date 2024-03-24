import { Link } from 'react-router-dom';

const CreateGame = () => {
  return (
    <>
      <p>Maybe one could fetch open game lobbies o,o</p>
      <Link to="/create_game">create game</Link>
    </>
  );
};

export default CreateGame;