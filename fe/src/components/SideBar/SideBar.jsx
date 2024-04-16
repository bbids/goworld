import NavLinks from '../NavLinks/NavLinks';

import { sidebar } from './SideBar.module.css';

const SideBar = () => {
  return (
    <div id='sidebar' className={sidebar}>
      <h1 style={{ gridColumn: '1/2' }}>Go World</h1>
      <NavLinks />
    </div>
  );
};

export default SideBar;