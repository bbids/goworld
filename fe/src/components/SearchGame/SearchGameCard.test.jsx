import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';

import { UserContext } from '../../contexts/UserContext';
import SearchGameCard from './SearchGameCard';
import * as GameWebSocket from '../../webSocket/GameWebSocket';
import gameService from '../../services/game';

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
const mockUserContext = {
  user: {
    userStatus: null,
  },
  setUser: vi.fn()
};

describe('SearchGameCard', () => {

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('renders Play button when user is not in QUEUE', () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContext}>
        <SearchGameCard />
      </UserContext.Provider>
    );
    const playButton = getByText('Play');
    expect(playButton).toBeInTheDocument();
  });

  it('renders stop button if user is in QUEUE', () => {
    const { getByText } = render(
      <UserContext.Provider value={{
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          userStatus: 'QUEUE'
        }
      }}>
        <SearchGameCard />
      </UserContext.Provider>
    );
    const stopButton = getByText('Stop');
    expect(stopButton).toBeInTheDocument();
  });

  it('show Play and hides text if Stop button is clicked', () => {
    const { getByText, rerender, queryByText } = render(
      <UserContext.Provider value={{
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          userStatus: 'QUEUE'
        }
      }}>
        <SearchGameCard />
      </UserContext.Provider>
    );
    const stopButton = getByText('Stop');
    expect(stopButton).toBeInTheDocument();
    fireEvent.click(stopButton);
    rerender(
      <UserContext.Provider value={{
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          userStatus: null
        }
      }}>
        <SearchGameCard />
      </UserContext.Provider>
    );
    const playButton = getByText('Play');
    expect(playButton).toBeInTheDocument();
    const hiddenText = queryByText('Attempting to join game');
    expect(hiddenText).toBeNull();
  });

  it('calls startSearching when play button is clicked', async () => {
    const { getByText } = render(
      <UserContext.Provider value={mockUserContext}>
        <SearchGameCard />
      </UserContext.Provider>
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