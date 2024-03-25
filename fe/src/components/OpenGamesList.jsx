import OpenGameCard from './OpenGameCard';

const OpenGamesList = ({ gamesData }) => {
  if (!gamesData) return (
    <p>No games available.</p>
  );

  return (
    <div className='gamesList'>
      {Object.values(gamesData)
        .filter(gameData => gameData.status === 'WAITING')
        .map(gameData =>
          <OpenGameCard key={gameData.gameId} gameData={gameData} />
        )}
    </div>
  );
};

export default OpenGamesList;