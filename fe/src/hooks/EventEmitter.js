const EventEmitter = {
  events: {},
  on: function(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  },
  off: function(event, listenerToRemove) {
    if (!this.events[event])
      return;

    this.events[event] = this.events[event].filter(listener => {
      return listener !== listenerToRemove;
    });
  },
  emit: function(event, data) {
    if (!this.events[event])
      return;
    this.events[event].forEach(listener => listener(data));
  }
};

export default EventEmitter;