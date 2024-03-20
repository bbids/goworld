import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import { playLoader, createGameLoader} from "./services/loaders";
import CreateGame from "./components/CreateGame";
import Game from "./components/Game";
import JoinGame from "./components/JoinGame";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    loader: playLoader,
  },
  // these 3 below should have the same parent,
  // but it should not be Home compent, rather
  // a navbar component
  {
    path: "/create_game",
    Component: CreateGame,
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