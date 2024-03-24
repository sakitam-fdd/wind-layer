import { test, expect, describe, beforeAll, afterAll, vi } from 'vitest';

vi.stubGlobal('AMap', vi.fn());

beforeAll(async () => {
  console.log(`[amap-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[amap-wind]: test end`);
});

describe('amap', async () => {
  test('instance', async () => {
    const { WindLayer } = await import('../src');
    const layer = new WindLayer([], {
      // projection: 'EPSG:4326',
      zIndex: 20,
      colorScale: 'rgb(255, 255, 255)',
      velocityScale: 1 / 30,
      paths: 1000,
      // bounds: map.getBounds(),
    });
    expect(layer).toBeInstanceOf(WindLayer);
  });
});
