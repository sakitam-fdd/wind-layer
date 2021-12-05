import { test, expect, describe, beforeAll, afterAll, vi } from 'vitest';

vi.stubGlobal('BMap', vi.mocked({
  Overlay: class {
  }
}));

beforeAll(async () => {
  console.log(`[bmap-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[bmap-wind]: test end`);
});

describe('bmap', async () => {
  test('instance', async () => {
    const { WindLayer } = await import('../src');
    const layer = new WindLayer([], {
      zIndex: 20,
      colorScale: "rgb(255, 255, 255)",
      velocityScale: 1 / 30,
      paths: 1000,
      // bounds: map.getBounds(),
    });
    expect(layer).toBeInstanceOf(WindLayer);
  });
});

