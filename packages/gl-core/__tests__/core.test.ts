import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { decodeHalfFloat, resolvePickerPixel } from '../src/utils/common';
import { createLinearGradient, normalizeColor } from '../src/utils/style-parser';

beforeAll(async () => {
  console.log(`[wind-gl-core]: start testing...`);
});

afterAll(async () => {
  console.log(`[wind-gl-core]: test end`);
});

describe('picker pixel resolution', () => {
  test('scales CSS pixel coordinates across DPR 1, 1.25, 1.5, 2, 3', () => {
    expect(resolvePickerPixel([400, 300], [800, 600], [800, 600])).toEqual([400, 300]);
    expect(resolvePickerPixel([400, 300], [800, 600], [1000, 750])).toEqual([500, 375]);
    expect(resolvePickerPixel([400, 300], [800, 600], [1200, 900])).toEqual([600, 450]);
    expect(resolvePickerPixel([400, 300], [800, 600], [1600, 1200])).toEqual([800, 600]);
    expect(resolvePickerPixel([400, 300], [800, 600], [2400, 1800])).toEqual([1200, 900]);
    expect(resolvePickerPixel([1000, 800], [2000, 1600], [1500, 1200])).toEqual([750, 600]);
  });

  test('handles fractional coordinates and clamps upper viewport edge', () => {
    expect(resolvePickerPixel([799.9, 599.9], [800, 600], [1600, 1200])).toEqual([1599, 1199]);
    expect(resolvePickerPixel([800 * 0.9999, 600 * 0.9999], [800, 600], [800, 600])).toEqual([799, 599]);
  });

  test('returns null for out-of-bounds or invalid inputs', () => {
    expect(resolvePickerPixel([-1, 100], [800, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([100, -0.1], [800, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([800, 300], [800, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([400, 600], [800, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([NaN, 100], [800, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([100, Infinity], [800, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([100, 100], [0, 600], [800, 600])).toBeNull();
    expect(resolvePickerPixel([100, 100], [800, 600], [800, 0])).toBeNull();
  });
});

describe('decodeHalfFloat', () => {
  test('decodes zero, signed zero, normal, subnormal, infinity, and NaN values', () => {
    expect(Object.is(decodeHalfFloat(0x0000), 0)).toBe(true);
    expect(Object.is(decodeHalfFloat(0x8000), -0)).toBe(true);
    expect(decodeHalfFloat(0x3c00)).toBe(1);
    expect(decodeHalfFloat(0xbc00)).toBe(-1);
    expect(decodeHalfFloat(0x4a40)).toBe(12.5);
    expect(decodeHalfFloat(0xc820)).toBe(-8.25);
    expect(decodeHalfFloat(0x0001)).toBeCloseTo(Math.pow(2, -24), 12);
    expect(decodeHalfFloat(0x7c00)).toBe(Infinity);
    expect(decodeHalfFloat(0xfc00)).toBe(-Infinity);
    expect(Number.isNaN(decodeHalfFloat(0x7e00))).toBe(true);
  });
});

describe('style-parser color normalization and ramp generation', () => {
  const originalDocument = globalThis.document;

  afterEach(() => {
    if (originalDocument === undefined) {
      delete (globalThis as any).document;
    } else {
      (globalThis as any).document = originalDocument;
    }
  });

  test('normalizeColor clamps alpha to [0, 1] per CSS Color spec while preserving valid CSS colors', () => {
    expect(normalizeColor('rgba(231, 215, 215, 256)')).toBe('rgba(231, 215, 215, 1)');
    expect(normalizeColor('rgba(98, 113, 183, 255)')).toBe('rgba(98, 113, 183, 1)');
    expect(normalizeColor('rgba(98, 113, 183, 128)')).toBe('rgba(98, 113, 183, 1)');
    expect(normalizeColor('rgba(98, 113, 183, 1.2)')).toBe('rgba(98, 113, 183, 1)');
    expect(normalizeColor('rgba(98, 113, 183, -0.5)')).toBe('rgba(98, 113, 183, 0)');
    expect(normalizeColor('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)');
    expect(normalizeColor('rgba(300, -10, 128, 0)')).toBe('rgba(255, 0, 128, 0)');
    expect(normalizeColor('rgb(10, 20, 30)')).toBe('rgb(10, 20, 30)');
    expect(normalizeColor('#3288bd')).toBe('#3288bd');
  });

  test('createLinearGradient produces 256x1 RGBA texture, respects zero range min, and clamps step sampling', () => {
    const colorStops: Array<{ offset: number; color: string }> = [];
    const getImageDataCalls: Array<{ x: number; y: number; w: number; h: number }> = [];

    (globalThis as any).document = {
      createElement: (tag: string) => {
        if (tag !== 'canvas') return {};
        const canvas: any = { width: 0, height: 0 };
        canvas.getContext = () => ({
          fillStyle: '',
          createLinearGradient: () => ({
            addColorStop: (offset: number, color: string) => {
              if (!color.startsWith('#') && !color.startsWith('rgb')) {
                throw new SyntaxError(`Invalid color: ${color}`);
              }
              const rgbaMatch = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
              if (rgbaMatch && Number(rgbaMatch[1]) > 1) {
                throw new SyntaxError(`Invalid alpha: ${color}`);
              }
              colorStops.push({ offset, color });
            },
          }),
          fillRect: () => undefined,
          getImageData: (x: number, y: number, w: number, h: number) => {
            getImageDataCalls.push({ x, y, w, h });
            const buf = new Uint8ClampedArray(w * h * 4);
            for (let i = 0; i < w * h; i += 1) {
              buf[i * 4] = 100;
              buf[i * 4 + 1] = 150;
              buf[i * 4 + 2] = 200;
              buf[i * 4 + 3] = 255;
            }
            return { data: buf };
          },
        });
        return canvas;
      },
    };

    const linearResult = createLinearGradient(
      [0, 100],
      ['interpolate', ['linear'], ['get', 'value'], 10, '#3288bd', 50, '#d53e4f'],
    );

    expect(linearResult.data).toBeInstanceOf(Uint8Array);
    expect(linearResult.data.byteLength).toBe(256 * 1 * 4);
    expect(linearResult.colorRange).toEqual([0, 100]);
    expect(colorStops).toEqual([
      { offset: 0.1, color: '#3288bd' },
      { offset: 0.5, color: '#d53e4f' },
    ]);

    colorStops.length = 0;
    getImageDataCalls.length = 0;

    const stepResult = createLinearGradient(
      [],
      ['interpolate', ['step', 1], ['get', 'value'], 0, 'rgba(0,0,0,255)', 1000, 'rgba(255,255,255,256)'],
    );

    expect(stepResult.data).toBeInstanceOf(Uint8Array);
    expect(stepResult.data.byteLength).toBe(256 * 1 * 4);
    expect(stepResult.colorRange).toEqual([0, 1000]);
    expect(colorStops).toEqual([
      { offset: 0, color: 'rgba(0, 0, 0, 1)' },
      { offset: 1, color: 'rgba(255, 255, 255, 1)' },
    ]);
    for (const call of getImageDataCalls) {
      expect(call.x).toBeGreaterThanOrEqual(0);
      expect(call.x).toBeLessThan(256);
    }
  });
});
