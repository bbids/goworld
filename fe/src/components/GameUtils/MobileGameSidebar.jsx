import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mobileButtons, mobileBtn} from './GameSideBar.module.css';

const MobileGameSidebar = () => {
  const [mobileNavState, setMobileNavState] = useState('board');
  const navStates = useMemo(() => {
    return ['board', 'chatbox'];
  }, []);
  const [navInd, setNavInd] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const setBoardState = () => {
      document.getElementById('userCards').classList.remove('hidden');
      document.getElementById('board').classList.remove('hidden');
      document.getElementById('chatbox').classList.add('hidden');
    };

    if (mobileNavState === 'board') {
      setBoardState();
      setNavInd(0);
    }
    else if (mobileNavState === 'chatbox') {
      document.getElementById('chatbox').classList.remove('hidden');
      document.getElementById('userCards').classList.add('hidden');
      document.getElementById('board').classList.add('hidden');
      setNavInd(1);
    }

    return () => {
      // we want to reset to default mode when leaving mobile mode
      setBoardState();
    };
  }, [mobileNavState]);

  const onLeftClick = () => {
    const newInd = (navInd - 1 + navStates.length) % navStates.length;
    setMobileNavState(navStates[newInd]);
  };

  const onRightClick = () => {
    const newInd = (navInd + 1) % navStates.length;
    setMobileNavState(navStates[newInd]);
  };

  const onExitClick = () => {
    const yes = confirm('sure?');
    if (yes) navigate('/play');
  };

  return (
    <>
      <div className={mobileButtons}>
        <button
          onClick={onLeftClick}
          className={mobileBtn}
        >{'<'}</button>

        <button
          onClick={onExitClick}
          className={mobileBtn}
        >Exit</button>

        <button
          onClick={onRightClick}
          className={mobileBtn}
        >{'>'}</button>
      </div>
    </>
  );
};

export default MobileGameSidebar;