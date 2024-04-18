import { userCard } from './GameSideBar.module.css';

const UserCards = () => {
  return (
    <div id='userCards'>
      <div className={userCard}>You</div>
      <div className={userCard}>B</div>
    </div>
  );
};

export default UserCards;