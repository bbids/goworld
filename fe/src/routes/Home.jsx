import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useContext, useEffect } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";

/**
 * GoWorld home page.
 * @returns
 */
const Home = () => {
  const { wsState, wsDispatch } = useContext(WebSocketContext);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      // close the game queue
      if (wsState.game?.status === 'WAITING') {
        wsState.websocket.instance.close();
        wsDispatch({ type: 'SET_GAME', payload: null });
      }
    }
  }, [location, wsState, wsDispatch]);

  return (
    <>
      <h1>Go World</h1>
      <NavBar />
      <hr />
      <Outlet wsState={wsState} wsDispatch={wsDispatch}/>
    </>
  );
};

export default Home;