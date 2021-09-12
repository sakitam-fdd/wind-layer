/**
 * ```js
 * [
 *   'interpolate',
 *   ['linear'],
 *   ['get', 'value'],
 *   0.0,
 *   '#3288bd',
 *   10,
 *   '#66c2a5',
 *   20,
 *   '#abdda4',
 * ]
 * ```
 */
import { findStopLessThanOrEqualTo, isNumber } from './common';

export function parseColorStyle(styleAttrField: any[]) {
  if (Array.isArray(styleAttrField) && styleAttrField.length > 3) {
    const type = styleAttrField[0]; // interpolate \ step
    const action = styleAttrField[1]; // linear
    const expression = styleAttrField[2];
    const interpolateColor = [];
    for (let i = 3; i < styleAttrField.length; i += 2) {
      const val = styleAttrField[i];
      const color = styleAttrField[i + 1];
      interpolateColor.push({
        key: val,
        value: color,
      });
    }
    return {
      operator: type,
      interpolation: {
        name: action[0],
        base: action[1],
      },
      input: interpolateColor,
    };
  } else {
    console.warn('[wind-core]: style-parser style config invalid');
    return {};
  }
}

export function parseZoomStyle(styleAttrField: any[]) {
  if (Array.isArray(styleAttrField) && styleAttrField.length > 3) {
    const type = styleAttrField[0]; // interpolate
    const action = styleAttrField[1]; // linear
    const expression = styleAttrField[2];
    const interpolateZoom = [];
    for (let i = 3; i < styleAttrField.length; i += 2) {
      const val = styleAttrField[i];
      const color = styleAttrField[i + 1];
      interpolateZoom.push({
        key: val,
        value: color,
      });
    }
    return {
      operator: type,
      interpolation: {
        name: action[0],
        base: action[1],
      },
      input: interpolateZoom,
    };
  } else {
    console.warn('[wind-core]: style-parser style config invalid');
    return {};
  }
}

export function createLinearGradient(
  range: any[],
  styleAttrField: any[],
): {
  data: Uint8Array;
  colorRange: [number, number];
} {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 1;

  const { input: interpolateColor } = parseColorStyle(styleAttrField);

  if (ctx && interpolateColor && Array.isArray(interpolateColor)) {
    const keys = interpolateColor.map((d) => parseFloat(d.key));
    const colorRange: [number, number] = [Math.min(...keys), Math.max(...keys)];
    const [min, max] = [range[0] || colorRange[0], range[1] || colorRange[1]];
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);

    for (let i = 0; i < interpolateColor.length; i += 1) {
      const key = interpolateColor[i].key;
      const color = interpolateColor[i].value;
      gradient.addColorStop((key - min) / (max - min), color);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);
    return {
      data: new Uint8Array(ctx.getImageData(0, 0, 256, 1).data),
      colorRange,
    };
  } else {
    // @ts-ignore
    return {};
  }
}

function exponentialInterpolation(
  input: number,
  base: number,
  lowerValue: number,
  upperValue: number,
) {
  const difference = upperValue - lowerValue;
  const progress = input - lowerValue;

  if (difference === 0) {
    return 0;
  } else if (base === 1) {
    return progress / difference;
  } else {
    return (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
  }
}

export type InterpolationType =
  | { name: 'linear' }
  | { name: 'exponential'; base: number }
  | { name: 'cubic-bezier'; controlPoints: [number, number, number, number] };

export function interpolationFactor(
  interpolation: InterpolationType,
  input: number,
  lower: number,
  upper: number,
) {
  let t = 0;
  if (interpolation.name === 'exponential') {
    t = exponentialInterpolation(input, interpolation.base, lower, upper);
  } else if (interpolation.name === 'linear') {
    t = exponentialInterpolation(input, 1, lower, upper);
  } else if (interpolation.name === 'cubic-bezier') {
    console.warn('interpolationFactor');
  }
  return t;
}

export function interpolateNumber(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

export type CachedStyleItem =
  | {
      operator: any;
      interpolation: any;
      input: Array<{ key: any; value: any }>;
    }
  | { operator?: undefined; interpolation?: undefined; input?: undefined };

const cachedStyle: {
  [key: string]: CachedStyleItem;
} = {};

export function createZoom(
  uid: string,
  zoom: number,
  key: string,
  styles: any,
  clearCache?: boolean,
): number {
  const ukey = `${uid}_${key}`;
  const styleAttrField = styles[key] as any[] | number;

  if (isNumber(styleAttrField)) {
    if (cachedStyle[ukey]) {
      delete cachedStyle[ukey];
    }
    return styleAttrField as number;
  }

  if (
    styleAttrField &&
    Array.isArray(styleAttrField) &&
    (!cachedStyle[ukey] || clearCache)
  ) {
    cachedStyle[ukey] = parseZoomStyle(styleAttrField);
  }

  if (cachedStyle[ukey]) {
    const { input: interpolateZoom, interpolation } = cachedStyle[ukey] || {};
    if (interpolateZoom && Array.isArray(interpolateZoom)) {
      const labels = interpolateZoom.map((i) => i.key);
      const outputs = interpolateZoom.map((i) => i.value);

      if (zoom <= labels[0]) {
        return outputs[0];
      }
      const stopCount = labels.length;
      if (zoom >= labels[stopCount - 1]) {
        return outputs[stopCount - 1];
      }

      const index = findStopLessThanOrEqualTo(labels, zoom);
      const idx = labels.length - 1;

      const lower = labels[index];
      const upper = labels[index >= idx ? idx : index + 1];

      const t = interpolationFactor(interpolation, zoom, lower, upper);

      const outputLower = outputs[index];
      const outputUpper = outputs[index >= idx ? idx : index + 1];

      return interpolateNumber(outputLower, outputUpper, t);
    } else {
      return 1;
    }
  }
  return 1;
}
