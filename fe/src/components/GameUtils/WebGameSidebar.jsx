import ChatBox from '../ChatBox/ChatBox';
import WebGameButtons from './WebGameButtons';
import Options from './Options';

const WebGameSidebar = ({ game }) => {
  return (
    <div id="optional" style={{
      width: '20em',
    }}>
      <WebGameButtons />
      <Options game={game} />
      <ChatBox />
    </div>
  );
};

export default WebGameSidebar;