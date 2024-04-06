import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';

import { WebSocketContext } from '../contexts/WebSocketContext';
import SearchGameCard from './SearchGameCard';
import * as GameWebSocket from '../webSocket/GameWebSocket';
import gameService from '../services/game';

import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect, vi, afterEach } from 'vitest';

expect.extend(matchers);

vi.mock('react-router-dom', () => {
  return {
    useNavigate: () => vi.fn()
  };
});

vi.mock('../websocket/GameWebSocket', () => {
  return vi.fn();
});


// Mocking WebSocketContext
const mockWebSocketContext = {
  wsState: {
    userStatus: null,
    websocket: {
      instance: {
        close: vi.fn()
      }
    }
  },
  wsDispatch: vi.fn()
};

describe('SearchGameCard', () => {

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('renders Play button when user is not in QUEUE', () => {
    const { getByText } = render(
      <WebSocketContext.Provider value={mockWebSocketContext}>
        <SearchGameCard />
      </WebSocketContext.Provider>
    );
    const playButton = getByText('Play');
    expect(playButton).toBeInTheDocument();
  });

  it('renders stop button if user is in QUEUE', () => {
    const { getByText } = render(
      <WebSocketContext.Provider value={{
        ...mockWebSocketContext,
        wsState: {
          ...mockWebSocketContext.wsState,
          userStatus: 'QUEUE'
        }
      }}>
        <SearchGameCard />
      </WebSocketContext.Provider>
    );
    const stopButton = getByText('Stop');
    expect(stopButton).toBeInTheDocument();
  });

  it('calls startSearching when play button is clicked', async () => {
    const { getByText } = render(
      <WebSocketContext.Provider value={mockWebSocketContext}>
        <SearchGameCard />
      </WebSocketContext.Provider>
    );
    const playButton = getByText('Play');
    const spy0 = vi.spyOn(gameService, 'createGame').mockImplementation(() => {
      return {
        gameId: 'mockedGameId'
      };
    });
    const spy = vi.spyOn(GameWebSocket, 'default');
    fireEvent.click(playButton);
    await waitFor(() => {
      expect(spy0).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('ws://localhost:3000/mockedGameId');
    });
  });

});