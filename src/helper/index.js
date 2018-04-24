/**
 * @returns {Number} the value x clamped to the range [low, high].
 */
const clamp = function (x, range) {
  return Math.max(range[0], Math.min(x, range[1]));
};

/**
 * @returns {Boolean} true if agent is probably a mobile device. Don't really care if this is accurate.
 */
const isMobile = function () {
  return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
};

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (width, height, Canvas) => {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
    return new Canvas(width, height)
  }
};

/**
 * bind
 * @param fn
 * @param context
 * @returns {Function}
 */
const bind = function (fn, context) {
  const args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
  return function () {
    return fn.apply(context, args || arguments);
  };
};

export {
  bind,
  clamp,
  isMobile,
  createCanvas
}
