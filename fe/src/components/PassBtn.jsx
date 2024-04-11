import { connection } from '../webSocket/connection';

const PassBtn = () => {

  const handleClick = () => {
    connection.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'PASS',
    }));
  };

  return (
    <>
      <button onClick={handleClick}>Pass</button>
    </>
  );
};

export default PassBtn;