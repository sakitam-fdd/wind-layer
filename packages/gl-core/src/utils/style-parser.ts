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
import { utils } from '@sakitam-gis/vis-engine';
import { findStopLessThanOrEqualTo } from './common';

export function parseColorStyle(styleAttrField: any[]) {
  if (Array.isArray(styleAttrField) && styleAttrField.length > 3) {
    const type = styleAttrField[0]; // interpolate
    const action = styleAttrField[1]; // linear / step
    // const expression = styleAttrField[2];
    const interpolateColor: any[] = [];
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
    // const expression = styleAttrField[2];
    const interpolateZoom: {
      key: string | number;
      value: string;
    }[] = [];
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

function createGradient(interpolateColor, min, max, w, h, gradient, ctx) {
  for (let i = 0; i < interpolateColor.length; i += 1) {
    const key = interpolateColor[i].key;
    const color = interpolateColor[i].value;
    gradient.addColorStop((key - min) / (max - min), color);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}
function createStepGradient(interpolateColor, min, max, w, h, ctx) {
  for (let i = 0; i < interpolateColor.length; i += 1) {
    const key = interpolateColor[i].key;
    let keyNext = key;
    if (i < interpolateColor.length - 1) {
      keyNext = interpolateColor[i + 1].key;
    } else {
      keyNext = max;
    }
    const color = interpolateColor[i].value;
    const current = ((key - min) / (max - min)) * w; // 0 - w
    const next = ((keyNext - min) / (max - min)) * w; // 0 - w
    ctx.fillStyle = color;
    ctx.fillRect(current, 0, next - current, 1);
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
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const { input: interpolateColor, interpolation } = parseColorStyle(styleAttrField);

  if (ctx && interpolateColor && Array.isArray(interpolateColor)) {
    const keys = interpolateColor.map((d) => parseFloat(d.key));
    const colorRange: [number, number] = [Math.min(...keys), Math.max(...keys)];
    const [min, max] = [range[0] || colorRange[0], range[1] || colorRange[1]];
    const w = 256;
    const h = 1;
    canvas.width = w;
    canvas.height = h;
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    if (interpolation?.name === 'linear') {
      createGradient(interpolateColor, min, max, w, h, gradient, ctx);
    } else if (interpolation?.name === 'step') {
      if (interpolation?.base === true || utils.isNumber(interpolation?.base)) {
        const interval = Number(interpolation?.base); // true == 1
        createGradient(interpolateColor, min, max, w, h, gradient, ctx);
        const len = Math.round((max - min) / interval);
        const canvas2 = document.createElement('canvas');
        const ctx2 = canvas2.getContext('2d', {
          willReadFrequently: true,
        }) as CanvasRenderingContext2D;
        canvas2.width = w;
        canvas2.height = h;
        for (let j = 0; j < len; j++) {
          let keyNext = j;
          if (j < len - 1) {
            keyNext = j + 1;
          } else {
            keyNext = len;
          }
          const current = Math.round((j / len) * w); // 0 - w
          const color = ctx.getImageData(current, 0, 1, 1).data;
          const next = Math.round((keyNext / len) * w); // 0 - w
          ctx2.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
          ctx2.fillRect(current, 0, next - current, h);
        }

        return {
          data: new Uint8Array(ctx2.getImageData(0, 0, w, h).data),
          colorRange,
        };
      } else if (interpolation?.base === false) {
        createStepGradient(interpolateColor, min, max, w, h, ctx);
      }
    } else {
      console.warn(`[wind-core]: invalid action type: ${interpolation}`);
    }
    return {
      data: new Uint8Array(ctx.getImageData(0, 0, w, h).data),
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

  if (utils.isNumber(styleAttrField)) {
    if (cachedStyle[ukey]) {
      delete cachedStyle[ukey];
    }
    return styleAttrField as number;
  }

  if (styleAttrField && Array.isArray(styleAttrField) && (!cachedStyle[ukey] || clearCache)) {
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
