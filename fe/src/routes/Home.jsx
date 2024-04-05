import { Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import SideBar from '../components/SideBar';

/**
 * GoWorld home page.
 * @returns
 */
const Home = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/play') {
      if (wsState.userStatus === 'QUEUE') {
        wsState.websocket.instance.close();
      }
    }

    // regex or fixed id?
    if (!location.pathname.match(/^\/game\/[a-zA-Z0-9]+$/)) {
      if (wsState.userStatus === 'GAME') {
        wsState.websocket.instance.close();
      }
    }

  }, [location.pathname, wsState, wsDispatch]);

  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
};

export default Home;