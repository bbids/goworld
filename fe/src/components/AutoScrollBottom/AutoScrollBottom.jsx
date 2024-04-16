import { reverse } from './AutoScrollBottom.module.css';

import chatbox from '../ChatBox/ChatBox.module.css';

/*
alternative: https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
*/


const AutoScrollBottom = ({ children }) => {
  return (
    <div className={`${reverse} ${chatbox.scroller}`}>
      {children}
    </div>
  );
};

export default AutoScrollBottom;