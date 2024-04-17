import { useEffect, useState } from 'react';
import ChatBox from '../ChatBox/ChatBox';
import PassBtn from '../PassBtn';

const GameSideBar = ({ game }) => {
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(game.status);
  }, [game.status]);

  return (
    <div id='game_sidebar'>
      <div id='game_foot'>
        <PassBtn />
        <p>We can now see status: {status}</p>
      </div>
      <ChatBox />
    </div>
  );
};

export default GameSideBar;