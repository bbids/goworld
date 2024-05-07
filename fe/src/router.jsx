import { createBrowserRouter } from 'react-router-dom';

import { getGameLoader } from './utils/loaders';

import { UserContextProvider } from './contexts/UserContext';

import Home from './routes/Home';
import Game from './routes/Game';
import ErrorPage from './routes/ErrorPage';
import Play from './routes/Play';
import GameBoundaryError from './GameError';

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
        path: '/',
        element: <div className='content'>Enjoy</div>
      },
      {
        path: 'play',
        element: <Play />,
      },
      {
        path: '/game/:gameId',
        element: <Game />,
        errorElement: <GameBoundaryError />,
        loader: getGameLoader // todo: find alternative solution
      },
    ]
  },
]);

export default router;