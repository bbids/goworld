import { useContext, useEffect } from 'react';
import { userCard } from './GameSideBar.module.css';
import { UserContext } from '../../contexts/UserContext';

import { black, white } from './GameSideBar.module.css';

const UserCards = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const userClass = user.color === 'black' ? black : white;
  const opponentClass = user.color === 'black' ? white : black;

  return (
    <div id='userCards'>
      <div
        className={`${userCard} ${userClass}`}
      >You</div>
      <div
        className={`${userCard} ${opponentClass}`}
      >Opponent</div>
    </div>
  );
};

export default UserCards;