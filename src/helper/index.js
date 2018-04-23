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
}

export {
  clamp,
  isMobile
}
