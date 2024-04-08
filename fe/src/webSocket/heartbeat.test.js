import { JSDOM } from 'jsdom';
import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import heartbeat from './heartbeat';

describe('heartbeat function test', () => {
  const mockWebsocket = {
    readyState: WebSocket.OPEN,
    close() {
      this.readyState = WebSocket.CLOSED;
    }
  };

  beforeEach(() => {
    const document = new JSDOM('<!DOCTYPE html><div id="game"></div>').window.document;
    vi.stubGlobal('document', document);

    vi.useFakeTimers();
  });

  afterEach(() => {
    mockWebsocket.readyState = WebSocket.CLOSED;
    vi.advanceTimersToNextTimer();
    vi.unstubAllGlobals();
  });

  describe('when websocket is open', () => {

    beforeEach(() => {
      mockWebsocket.readyState = WebSocket.OPEN;
    });

    it('does not retry if game is not in dom', () => {
      document.getElementById('game').remove();

      const spy = vi.spyOn(mockWebsocket, 'close');

      heartbeat(mockWebsocket);

      vi.advanceTimersToNextTimer();
      expect(spy).toHaveBeenCalledOnce();
      vi.advanceTimersToNextTimer();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('retries if game is in dom', () => {
      const spy = vi.spyOn(mockWebsocket, 'close');

      expect(document.getElementById('game')).toBeTruthy();

      heartbeat(mockWebsocket);

      vi.advanceTimersToNextTimer();
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersToNextTimer();
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersToNextTimer();
      expect(spy).not.toHaveBeenCalled();
    });

    it('stops retrying after later it is closed', () => {
      const spy = vi.spyOn(mockWebsocket, 'close');
      heartbeat(mockWebsocket);

      vi.advanceTimersToNextTimer();
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersToNextTimer();
      expect(spy).not.toHaveBeenCalled();

      document.getElementById('game').remove();

      vi.advanceTimersToNextTimer();
      expect(spy).toHaveBeenCalledOnce();
      vi.advanceTimersToNextTimer();
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('when websocket is not open', () => {

    beforeEach(() => {
      mockWebsocket.readyState = WebSocket.CLOSED;
    });

    it('it does not retry if game is in dom', () => {
      const spy = vi.spyOn(mockWebsocket, 'close');

      heartbeat(mockWebsocket);

      vi.advanceTimersToNextTimer();

      expect(spy).not.toHaveBeenCalled();

      vi.advanceTimersToNextTimer();

      expect(spy).not.toHaveBeenCalled();

    });
  });

});