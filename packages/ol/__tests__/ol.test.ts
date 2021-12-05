import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { WindLayer } from '../src';

beforeAll(async () => {
  console.log(`[ol-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[ol-wind]: test end`);
});

describe('ol', async () => {
  test('instance', async () => {
    const layer = new WindLayer([], {
      zIndex: 20,
      colorScale: "rgb(255, 255, 255)",
      velocityScale: 1 / 30,
      paths: 1000,
    });
    expect(layer).toBeInstanceOf(WindLayer);
  });
});
