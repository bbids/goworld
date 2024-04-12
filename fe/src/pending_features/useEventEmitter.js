import { useEffect } from 'react';
import EventEmitter from './EventEmitter';

const useEventEmitter = (eventName, listener) => {
  useEffect(() => {
    EventEmitter.on(eventName, listener);

    return () => {
      EventEmitter.off(eventName, listener);
    };
  }, [eventName, listener]);
};

export default useEventEmitter;