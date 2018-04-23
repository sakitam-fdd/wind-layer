import { bind } from '../utils'

window.requestAnimFrame = function (fn, immediate, context, element) {
  const f = bind(fn, context);
  const request = (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    });
  if (request) {
    return request.call(window, f, element);
  } else {
    if (immediate) {
      f();
    } else {
      return window.setTimeout(f, 16);
    }
  }
};

const getCancelAnimFrame = function () {
  const prefixs = ['webkit', 'moz', 'o', 'ms'];
  let func = window.cancelAnimationFrame;
  for (let i = 0, len = prefixs.length; i < len && !func; i++) {
    func = window[prefixs[i] + 'CancelAnimationFrame'] || window[prefixs[i] + 'CancelRequestAnimationFrame'];
  }
  return func;
};

window.cancelAnimFrame = function (id) {
  const cancel = getCancelAnimFrame();
  if (cancel) {
    cancel.call(window, id);
  } else {
    window.clearTimeout(id);
  }
};
