import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';

import Board from './Board';

import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { UserContext } from '../contexts/UserContext';
import { connection } from '../webSocket/connection';

expect.extend(matchers);

vi.mock('../utils/canvas.js', () => {
  return {
    drawGrid: vi.fn(),
    drawBackgroundDefault: vi.fn(),
    getRowAndCol: vi.fn().mockImplementation(() => { return { row: 0, col: 0 }; })
  };
});


const mockUserContext = {
  user: {
    userStatus: 'GAME',
  },
  setUser: vi.fn()
};

vi.mock('../websocket/gameWebSocketUtils', () => {
  return {
    connection: {
      send: vi.fn()
    }
  };
});


describe('BOARD', () => {

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('when clicking on a board, sends move request', async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={mockUserContext}>
        <Board game={ { board: null } }/>
      </UserContext.Provider>
    );
    let success = false;

    const spy = vi.spyOn(connection, 'send').mockImplementation(() => {
      success = true;
    });

    const boardCanvas = getByTestId('board');
    fireEvent.click(boardCanvas, new MouseEvent('click'));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
    expect(success).toBeTruthy();
  });
});