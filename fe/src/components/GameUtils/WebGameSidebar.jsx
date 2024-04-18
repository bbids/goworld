import WebGameButtons from './WebGameButtons';
import Options from './Options';

const WebGameSidebar = ({ game }) => {
  return (
    <div id="optional" style={{
      width: '20em',
    }} className='optional'>
      <WebGameButtons />
      <Options game={game} />
    </div>
  );
};

export default WebGameSidebar;