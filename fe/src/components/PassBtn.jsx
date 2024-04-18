import { connection } from '../webSocket/connection';

const PassBtn = ({ classes }) => {

  const handleClick = () => {
    connection.send(JSON.stringify({
      type: 'EVENT',
      eventName: 'PASS',
    }));
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={classes}
      >Pass</button>
    </>
  );
};

export default PassBtn;