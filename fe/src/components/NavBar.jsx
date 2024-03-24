import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/play'>Play</Link></li>
        <li><Link to='/game'>Game</Link></li>
      </ul>
    </>
  );
};

export default NavBar;