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

const getExtent = (coords) => {
  const extent = [
    Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY
  ];
  return coords.reduce((prev, coord) => {
    return [
      Math.min(coord[0], prev[0]),
      Math.min(coord[1], prev[1]),
      Math.max(coord[0], prev[2]),
      Math.max(coord[1], prev[3])
    ];
  }, extent);
}

export {
  getExtent,
  getSpeed,
  createCanvas,
  getDirection
}
