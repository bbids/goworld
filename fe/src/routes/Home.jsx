import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import SideBar from '../components/SideBar';
import { connection } from '../webSocket/connection';

/**
 * GoWorld home page.
 * @returns
 */
const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/play') {
      if (user.userStatus === 'QUEUE') {
        connection.reset();
        setUser({ type: 'RESET' });
      }
    }

    // we match regex not fixed id, since it is impossible for
    // a user to go from game to another game without refreshing
    if (!location.pathname.match(/^\/game\/[a-zA-Z0-9]+$/)) {
      if (user.userStatus === 'GAME') {
        connection.reset();
        setUser({ type: 'RESET' });
      }
    }

  }, [location.pathname, user, setUser]);

  useEffect(() => {
    const callback = () => {
      const shouldMove = confirm('Double pass. Game over. Navigate to play page?');
      if (shouldMove)
        navigate('/play');
    };
    document.addEventListener('resetEvent', callback);

    return () => {
      document.removeEventListener('resetEvent', callback);
    };
  });

  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
};

export default Home;