import { useEffect, useState } from 'react';

const Options = ({ game }) => {
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(game.status);
  }, [game.status]);

  return (
    <div id='options' className='hidden'>
      <div id='game_foot'>
        <p>Status: {status}</p>
      </div>
    </div>
  );
};

export default Options;