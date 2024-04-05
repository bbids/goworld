import { createBrowserRouter } from 'react-router-dom';

import { gameValidLoader } from './utils/loaders';

import { WebSocketContextProvider } from './contexts/WebSocketContext';

import Home from './routes/Home';
import Game from './routes/Game';
import ErrorPage from './routes/ErrorPage';
import Play from './routes/Play';


// App at the tom

// reducer in the App

// Sidebar in app

// Outlet in App

// Context.Provider around Outlet

// wsState and wsDispatch should be safe

// use a cleanup function in the Game useEffect



const router = createBrowserRouter([
  {
    path: '/',
    element:
      <>
        <WebSocketContextProvider>
          <Home />
        </WebSocketContextProvider>
      </>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'play',
        element: <Play />,
      },
      {
        path: '/game/:gameId',
        element: <Game />,
        loader: gameValidLoader
      },
    ]
  },
]);

export default router;