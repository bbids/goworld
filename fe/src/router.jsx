import { createBrowserRouter } from "react-router-dom";

import { getGamesLoader, joinGameLoader } from "./utils/loaders";

import { WebSocketContextProvider } from "./contexts/WebSocketContext";

import Home from "./components/Home";
import Game from "./routes/Game";
import ErrorPage from "./routes/ErrorPage";
import Play from "./routes/Play";

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <>
        <WebSocketContextProvider>
          <Home />
        </WebSocketContextProvider>
      </>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "play",
        element: <Play />,
        loader: getGamesLoader
      },
      {
        path: "/game/:gameId",
        element: <Game />,
        loader: joinGameLoader
      },
    ]
  },
]);

export default router;