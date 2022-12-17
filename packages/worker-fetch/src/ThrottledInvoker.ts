import { nullFunction } from './util';

/**
 * Invokes the wrapped function in a non-blocking way when trigger() is called. Invocation requests
 * are ignored until the function was actually invoked.
 */
class ThrottledInvoker {
  channel: WithNull<MessageChannel>;
  triggered: boolean;
  callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
    this.triggered = false;
    if (typeof MessageChannel !== 'undefined') {
      this.channel = new MessageChannel();
      this.channel.port2.onmessage = () => {
        this.triggered = false;
        this.callback();
      };
    }
  }

  trigger() {
    if (!this.triggered) {
      this.triggered = true;
      if (this.channel) {
        this.channel.port1.postMessage(true);
      } else {
        setTimeout(() => {
          this.triggered = false;
          this.callback();
        }, 0);
      }
    }
  }

  remove() {
    this.channel = null;
    this.callback = nullFunction;
  }
}

export default ThrottledInvoker;
