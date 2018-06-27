/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (width, height, Canvas) => {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
    return new Canvas(width, height);
  }
};

const getDirection = (uMs, vMs, angleConvention) => {
  // Default angle convention is CW
  if (angleConvention.endsWith('CCW')) {
    // vMs comes out upside-down..
    vMs = vMs > 0 ? vMs = -vMs : Math.abs(vMs);
  }
  const velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
  const velocityDir = Math.atan2(uMs / velocityAbs, vMs / velocityAbs);
  let velocityDirToDegrees = velocityDir * 180 / Math.PI + 180;
  if (angleConvention === 'bearingCW' || angleConvention === 'meteoCCW') {
    velocityDirToDegrees += 180;
    if (velocityDirToDegrees >= 360) velocityDirToDegrees -= 360;
  }
  return velocityDirToDegrees;
};

const getSpeed = (uMs, vMs, unit) => {
  const velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
  // Default is m/s
  if (unit === 'k/h') {
    return meterSec2kilometerHour(velocityAbs);
  } else if (unit === 'kt') {
    return meterSec2Knots(velocityAbs);
  } else {
    return velocityAbs;
  }
};

const meterSec2Knots = (meters) => {
  return meters / 0.514
};

const meterSec2kilometerHour = (meters) => {
  return meters * 3.6
};

export {
  getSpeed,
  createCanvas,
  getDirection
}
