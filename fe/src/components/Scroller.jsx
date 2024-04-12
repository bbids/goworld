import './Scroller.css';

/*
https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
*/


const AutoScrollBottom = ({ children }) => {
  return (
    <div id='scroller'>
      {children}
    </div>
  );
};

export default AutoScrollBottom;