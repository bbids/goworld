import { useState } from 'react';

import { searchForm, button} from './SearchGameCard.module.css';


const SearchForm = ({ startSearching, selectedBoardSizeRef }) => {
  const [selectedBoardSize, setSelectedBoardSize] = useState(19);

  const boardSizes = [9, 13, 19];
  const handleBoardSizeChange = (event) => {
    const newSize = Number(event.target.value);
    setSelectedBoardSize(newSize);
    selectedBoardSizeRef.current = newSize;
  };

  return (
    <form onSubmit={startSearching} className={searchForm}>
      <p>
        <label htmlFor='selectedBoardSize'>Board size: </label>
        <select
          id="selectedBoardSize"
          value={selectedBoardSize}
          onChange={handleBoardSizeChange}
        >
          {boardSizes.map(val => {
            return <option key={val}>{val}</option>;
          })}
        </select>
      </p>
      <button type='submit' className={button}>Play</button>
    </form>
  );
};

export default SearchForm;