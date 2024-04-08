import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { connection } from '../webSocket/connection';
import Board from '../components/Board';

/**
 * Loader checks if game is valid, if it isn't it redirects to
 * somewhere else
 */

/**
 * This route component should manage the actual
 * gameplay screen
 * @returns
 */
const Game = () => {
  const { user, setUser } = useContext(UserContext);
  const [game, setGame] = useState({});
  const gameId = useParams().gameId;

  useEffect(() => {
    const callback = (event) => {
      const changes = event.detail.mutation;
      setGame(pgame => ({...pgame, ...changes }));
    };

    document.addEventListener('mutation', callback);

    return () => {
      document.removeEventListener('mutation', callback);
    };
  }, []);

  // initialize after connection
  useEffect(() => {
    const initialise = () => {
      document.removeEventListener('wsConnection', initialise);
      setUser({ type: 'SET_USERSTATUS', payload: 'GAME' });
      connection.send(JSON.stringify({
        type: 'EVENT',
        eventName: 'GAME_READY'
      }));
    };

    document.addEventListener('wsConnection', initialise);

    return () => {
      document.removeEventListener('wsConnection', initialise);
    };
  }, [setUser]);


  // dispatch trigger event : starting point
  useEffect(() => {
    if (user.userStatus === 'GAME'
      || user.userStatus === 'CONNECTING')
      return;

    setUser({ type: 'SET_USERSTATUS', payload: 'CONNECTING' });

    if (!connection.isOpen()) {
      connection.establish(gameId);
    }
    connection.dispatchEvent();
  }, [user, setUser, gameId]);

  const sayHi = () => {
    if (connection.isOpen())
      connection.send(JSON.stringify({
        type: 'MESSAGE',
        message: 'HI!'
      }));
  };


  return (
    <div id='game' className='content'>

      <Board />

      <p>We need a chat as well ..</p>
      <button onClick={sayHi}>sayHi</button>

      <p>We can now see status: {game?.status}</p>
    </div>
  );
};

export default Game;