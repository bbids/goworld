import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

/**
 * GoWorld home page.
 * @returns
 */
const Home = () => {

  return (
    <>
      <h1>Go World</h1>
      <NavBar />
      <hr />
      <Outlet />
    </>
  );
};

export default Home;