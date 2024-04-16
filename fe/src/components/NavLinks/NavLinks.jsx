import { Link } from 'react-router-dom';
import { navLinks, container, link, item} from './NavLinks.module.css';
import { useEffect } from 'react';

const NavLinks = () => {

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 500) {
        1;
        /* todo, a button instead of nav links */
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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
        <li className={item}>
          <Link className={link} to='/'>
            AI
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavLinks;