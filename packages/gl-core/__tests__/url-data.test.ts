import { describe, expect, test } from 'vitest';
import { bboxEpsg3857 } from '../src/source/urlData';

const HALF = Math.PI * 6378137; // 20037508.342789244

const parse = (s: string) => s.split(',').map(Number);

describe('bboxEpsg3857', () => {
  test('z0 covers the full EPSG:3857 extent with raw precision (same as mapbox-gl)', () => {
    const bbox = bboxEpsg3857({ x: 0, y: 0, z: 0, s: '', scheme: 'xyz' });
    expect(bbox).toBe(`${-HALF},${-HALF},${HALF},${HALF}`);
    // 不应截断小数
    expect(bbox).toContain('20037508.342789244');
  });

  test('xyz tiles at z1', () => {
    expect(parse(bboxEpsg3857({ x: 0, y: 0, z: 1, s: '', scheme: 'xyz' }))).toEqual([-HALF, 0, 0, HALF]);
    expect(parse(bboxEpsg3857({ x: 1, y: 1, z: 1, s: '', scheme: 'xyz' }))).toEqual([0, -HALF, HALF, 0]);
  });

  test('matches mapbox-gl CanonicalTileID#url output', () => {
    // 参考实现：mapbox-gl src/source/tile_id.ts 中的 getMercCoords + bbox 拼接（y 先翻转为自下而上）
    const mapboxBBox = (x: number, y: number, z: number) => {
      const getMercCoords = (mx: number, my: number, mz: number) => {
        const resolution = (2 * Math.PI * 6378137) / 256 / Math.pow(2, mz);
        return [mx * resolution - (2 * Math.PI * 6378137) / 2.0, my * resolution - (2 * Math.PI * 6378137) / 2.0];
      };
      const flippedY = Math.pow(2, z) - y - 1;
      const min = getMercCoords(x * 256, flippedY * 256, z);
      const max = getMercCoords((x + 1) * 256, (flippedY + 1) * 256, z);
      return `${min[0]},${min[1]},${max[0]},${max[1]}`;
    };

    for (const [x, y, z] of [
      [4, 2, 3],
      [0, 0, 1],
      [123, 456, 10],
      [1023, 0, 10],
    ]) {
      expect(bboxEpsg3857({ x, y, z, s: '', scheme: 'xyz' })).toBe(mapboxBBox(x, y, z));
    }
  });

  test('tms scheme yields the same geographic bbox for the same tile', () => {
    const z = 3;
    const xyzY = 2;
    const tmsY = Math.pow(2, z) - xyzY - 1;
    expect(bboxEpsg3857({ x: 4, y: tmsY, z, s: '', scheme: 'tms' })).toBe(
      bboxEpsg3857({ x: 4, y: xyzY, z, s: '', scheme: 'xyz' }),
    );
  });

  test('adjacent tiles share edges exactly', () => {
    const a = parse(bboxEpsg3857({ x: 2, y: 3, z: 4, s: '', scheme: 'xyz' }));
    const right = parse(bboxEpsg3857({ x: 3, y: 3, z: 4, s: '', scheme: 'xyz' }));
    const below = parse(bboxEpsg3857({ x: 2, y: 4, z: 4, s: '', scheme: 'xyz' }));
    expect(a[2]).toBe(right[0]);
    expect(a[1]).toBe(below[3]);
  });
});
