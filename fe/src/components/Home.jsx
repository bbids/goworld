import { Link, Outlet, useLoaderData } from "react-router-dom";

/**
 * GoWorld home page.
 * @returns 
 */
const Home = () => {
  const data = useLoaderData();

  console.log(data.success);

  return (
    <>
      <h1>Go World</h1>

      { data.success ? 
        <Link to="/create_game">create game</Link>
        : null 
      }

      <Outlet />
    </>
  );
};

export default Home;