/*
import { render } from '@testing-library/react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import Game from './Game';

import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, vi, expect } from 'vitest';

expect.extend(matchers);

import { MemoryRouter } from 'react-router-dom';

describe('Game Component', async () => {
  it('WebSocket state is properly set', async () => {
    // const gameData = await gameService.createGame();
    const res = await fetch(`http://localhost:3000/api/play/create_game`);
    const { gameId } = await res.json();

    // Render the Game component with mocked context value
    const { getByText } = render(
      <MemoryRouter initialEntries={[`/game/${gameId}`]}>
        <WebSocketContext.Provider value={{ 1: 1, 2: 1}}>
          <Game />
        </WebSocketContext.Provider>
      </MemoryRouter>
    );

    const sayHiButton = getByText('sayHi');
    expect(sayHiButton).toBeInTheDocument();
  });
});
*/
