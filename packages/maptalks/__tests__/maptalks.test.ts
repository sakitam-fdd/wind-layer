import { test, expect, describe, beforeAll, afterAll } from 'vitest';
// import { WindLayer } from '../src';

beforeAll(async () => {
  console.log(`[maptalks-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[maptalks-wind]: test end`);
});

describe('maptalks', async () => {
  test('instance', async () => {
    // const layer = new WindLayer('wind-layer', [], {
    //   zIndex: 20,
    //   colorScale: "rgb(255, 255, 255)",
    //   velocityScale: 1 / 30,
    //   paths: 1000,
    // });
    expect(1).toBe(1);
  });
});
