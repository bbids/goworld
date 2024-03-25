import { createBrowserRouter } from "react-router-dom";

import { createGameLoader, getGamesLoader } from "./utils/loaders";

import Home from "./components/Home";
import Game from "./routes/Game";
import JoinGame from "./routes/JoinGame";
import ErrorPage from "./routes/ErrorPage";
import Play from "./routes/Play";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "play",
        element: <Play />,
        loader: getGamesLoader
      },
      {
        path: "/create_game",
        loader: createGameLoader
      },
      {
        path: "/join/:id",
        element: <JoinGame />,
      },
      {
        path: "/game",
        element: <Game />
      }
    ]
  },
]);

export default router;