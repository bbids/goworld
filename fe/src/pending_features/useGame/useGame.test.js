import { renderHook } from '@testing-library/react';
import { it, expect, describe } from 'vitest';

import useGame from './useGame';

// todo: logger?

describe('useGame', () => {
  it('game listens', () => {
    const { result, rerender} = renderHook(() => useGame());

    const mutate1 = {
      love: true
    };

    result.current.gameMutationListener(mutate1);
    rerender();

    expect(result.current.game).toEqual({ love: true });

    const mutate2 = {
      newProperty: {
        test: 'true',
      }
    };
    result.current.gameMutationListener(mutate2);
    rerender();

    expect(result.current.game).toEqual({ love: true, newProperty: { test: 'true' } });
  });

  it('state setter enques state changes correctly', () => {
    const { result, rerender} = renderHook(() => useGame());

    const mutate1 = {
      love: true
    };

    result.current.gameMutationListener(mutate1);

    const mutate2 = {
      newProperty: {
        test: 'true',
      }
    };
    result.current.gameMutationListener(mutate2);
    rerender();

    expect(result.current.game).toEqual({ love: true, newProperty: { test: 'true' } });
  });

  it('exits cleanly if mutation is null', () => {
    const { result, rerender} = renderHook(() => useGame());

    const mutate1 = null;

    const gameBefore = result.current.game;

    expect(() =>
      result.current.gameMutationListener(mutate1)
    ).not.toThrowError();
    rerender();

    const gameAfter = result.current.game;

    expect(gameBefore).toEqual(gameAfter);
  });

  it('exits cleanly if mutation is a string (say it wasnt parsed)', () => {
    const { result, rerender} = renderHook(() => useGame());

    const mutate1 = JSON.stringify({ love: 'false' });

    const gameBefore = result.current.game;

    expect(() =>
      result.current.gameMutationListener(mutate1)
    ).not.toThrowError();
    rerender();

    const gameAfter = result.current.game;

    expect(gameBefore).toEqual(gameAfter);
  });
});