import { useState } from 'react';

const OptionalBtn = ({ itemId, text }) => {
  const [showItem, setShowItem] = useState(false);


  const viewItem = () => {
    document.getElementById(itemId).classList.remove('hidden');
    if (window.innerWidth < 800) {
      document.getElementById('board').classList.add('hidden');
      document.getElementById('userCards').classList.add('hidden');
    }
    setShowItem(true);
  };

  const hideItem = () => {
    document.getElementById(itemId).classList.add('hidden');
    document.getElementById('board').classList.remove('hidden');
    document.getElementById('userCards').classList.remove('hidden');
    setShowItem(false);
  };


  return (
    <>
      {showItem ?
        <button onClick={hideItem}>{text}</button>
        :
        <button onClick={viewItem}>{text}</button>
      }
    </>
  );
};

export default OptionalBtn;