import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { connection } from '../webSocket/connection';
import Board from '../components/Board';
import PassBtn from '../components/PassBtn';
import ChatBox from '../components/ChatBox/ChatBox';

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

  // some UI
  const [status, setStatus] = useState();
  useEffect(() => {
    setStatus(game.status);
  }, [game.status]);

  // Game data mutation
  useEffect(() => {
    const callback = (event) => {
      const changes = event.detail.mutation;
      setGame(pgame => ({ ...pgame, ...changes }));
    };

    document.addEventListener('mutation', callback);

    return () => {
      document.removeEventListener('mutation', callback);
    };
  }, []);

  // initialize after connection
  useEffect(() => {
    const initialise = () => {
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
      || user.userStatus === 'CONNECTING'
      || connection.dispatched)
      return;

    setUser({ type: 'SET_USERSTATUS', payload: 'CONNECTING' });

    if (!connection.isOpen()) {
      connection.establish(gameId);
    }

    connection.dispatchEvent();
  }, [user, setUser, gameId]);

  return (
    <div id='game' className='content'>

      <Board game={game} />

      <div id='game_sidebar'>
        <div id='game_foot'>
          <PassBtn />
          <p>We can now see status: {status}</p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
};

export default Game;