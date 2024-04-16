import { Link } from 'react-router-dom';
import { navLinks, container, link, item} from './NavLinks.module.css';

const NavLinks = () => {
  return (
    <nav className={navLinks}>
      <ul className={container}>
        <li className={item}>
          <Link className={link} to='/'>
            Home
          </Link>
        </li>
        <li className={item}>
          <Link className={link} to='/play'>
            Play
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavLinks;