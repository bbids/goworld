import OpenGameCard from './OpenGameCard';

const OpenGamesList = ({ gamesData }) => {
  const waitingGames = Object.values(gamesData).filter((game => {
    return game.status === 'WAITING';
  }));

  return (
    <div className='gamesList' data-testid='gamesList'>
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