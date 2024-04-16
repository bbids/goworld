import OpenGameCard from './OpenGameCard';

import { openGamesList } from './OpenGameCardList.module.css';

const OpenGamesList = ({ gamesData }) => {
  const waitingGames = Object.values(gamesData).filter((game => {
    return game.status === 'WAITING';
  }));

  return (
    <div className={openGamesList} data-testid='gamesList'>
      {waitingGames.length > 0 ?
        waitingGames.map(game =>
          <OpenGameCard key={game.gameId} gameData={game} />
        )
        :
        <p>No games available</p>
      }
    </div>
  );
};

export default OpenGamesList;