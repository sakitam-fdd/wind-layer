import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import OlWind from '../src';

beforeAll(async () => {
  console.log(`[ol5-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[ol5-wind]: test end`);
});

describe('ol5', async () => {
  test('instance', async () => {
    const layer = new OlWind([], {
      zIndex: 20,
      colorScale: 'rgb(255, 255, 255)',
      velocityScale: 1 / 30,
      paths: 1000,
    });
    expect(layer).toBeInstanceOf(OlWind);
  });
});
