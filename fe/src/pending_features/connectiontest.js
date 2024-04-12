import { it, expect, describe, vi } from 'vitest';
import { connection } from '../webSocket/connection';
import gameService from '../services/game';


vi.mock('./GameWebSocket.js', () => {
  return {
    raw: {
      addEventListener: vi.fn()
    },
    default: vi.fn()
  };
});

vi.mock('./connection.js', async (importOriginal) => {
  const other = await importOriginal();
  return {
    connection: {
      ...other.connection,
      websocket: {
        raw: {
          addEventListener: vi.fn()
        },
        isOpen: vi.fn(() => true)
      },
    }
  };
});

describe('connection singleton', () => {

  it('..', async () => {
    vi.spyOn(gameService, 'createGame').mockImplementation(() => {
      return {
        gameId: 'mockedGameId'
      };
    });

    connection.establish();

    connection.websocket.send = vi.fn(() => true);

    const result = connection.send();
    expect(result).toBeTruthy();

  });

});