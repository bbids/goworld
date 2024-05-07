import { useRouteError } from 'react-router-dom';

const GameBoundaryError = () => {
  const error = useRouteError();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div>{error.status}</div>
      <div>{error.data}</div>
    </div>
  );
};

export default GameBoundaryError;