import { reverse } from './AutoScrollBottom.module.css';
/*
alternative: https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
*/


const AutoScrollBottom = ({ children, classes }) => {
  return (
    <div className={`${reverse} ${classes}`}>
      {children}
    </div>
  );
};

export default AutoScrollBottom;