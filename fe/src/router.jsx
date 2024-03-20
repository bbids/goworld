import { createBrowserRouter } from "react-router-dom";

import { homePageLoader, createGameLoader} from "./services/loaders";

import Home from "./components/Home";
import CreateGame from "./components/CreateGame";
import Game from "./components/Game";
import JoinGame from "./components/JoinGame";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    loader: homePageLoader,
  },
  // these 3 below should have the same parent,
  // but it should not be Home compent, rather
  // a navbar component
  {
    path: "/create_game",
    Component: CreateGame, // In case game creation fails, later use error page
    loader: createGameLoader
  },
  {
    path: "/join/:id",
    Component: JoinGame
  },
  {
    path: "/game/:id",
    Component: Game
  }
])

export default router;