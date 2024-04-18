import PassBtn from '../PassBtn';
import OptionalBtn from './OptionalBtn';

import { buttons } from './GameSideBar.module.css';

const WebGameButtons = () => {
  return (
    <div className={buttons}>
      <OptionalBtn
        itemId={'options'}
        text={'Options'}
      />
      <OptionalBtn
        itemId={'sidebar'}
        text={'Leave'}
      />
      <OptionalBtn
        itemId={'chatbox'}
        text={'Chat'}
      />
      <PassBtn />
    </div>
  );
};

export default WebGameButtons;