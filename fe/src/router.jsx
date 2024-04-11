import { createBrowserRouter } from 'react-router-dom';

import { gameValidLoader } from './utils/loaders';

import { UserContextProvider } from './contexts/UserContext';

import Home from './routes/Home';
import Game from './routes/Game';
import ErrorPage from './routes/ErrorPage';
import Play from './routes/Play';

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <>
        <UserContextProvider>
          <Home />
        </UserContextProvider>
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