import NavLinks from '../NavLinks/NavLinks';

import { sidebar, strap } from './SideBar.module.css';

const SideBar = () => {
  return (
    <div id='sidebar' className={sidebar}>
      <div className={strap}></div>
      <div className={strap}></div>
      <div className={strap}></div>
      <div className={strap}></div>
      <div className={strap}></div>
      <div>
        <div>
          <p style={{ gridColumn: '1/2', fontSize: '2em' }}>GoWorld</p>
        </div>
        <NavLinks />
      </div>
    </div>
  );
};

export default SideBar;