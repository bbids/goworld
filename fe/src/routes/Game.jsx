import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';


import { connection } from '../webSocket/connection';
import Board from '../components/Board/Board';
import UserCards from '../components/GameUtils/UserCards';
import MobileGameSidebar from '../components/GameUtils/MobileGameSidebar';
import WebGameSidebar from '../components/GameUtils/WebGameSidebar';
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
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 800);

  const gameId = useParams().gameId;

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


  // hide sidebar by default on start
  useEffect(() => {
    document.getElementById('sidebar').classList.add('hidden');

    return () => {
      document.getElementById('sidebar').classList.remove('hidden');
    };
  }, []);


  // resize listener for mobile/web mode switch
  useEffect(() => {
    const callback = () => {
      const isMobile = window.innerWidth <= 768;
      setMobileMode(isMobile);
    };

    window.addEventListener('resize', callback);

    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  return (
    <div id='game' className='content'>
      <UserCards game={game} />
      <Board game={game} />

      {mobileMode ?
        <MobileGameSidebar />
        :
        <WebGameSidebar game={game} />
      }

      <ChatBox />
    </div>
  );
};

export default Game;