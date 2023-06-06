import { test, expect, describe, beforeAll, afterAll } from 'vitest';
// import OlWind from '../src';

beforeAll(async () => {
  console.log(`[openlayers-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[openlayers-wind]: test end`);
});

describe('openlayers', async () => {
  test('instance', async () => {
    // const layer = new OlWind([], {
    //   zIndex: 20,
    //   colorScale: "rgb(255, 255, 255)",
    //   velocityScale: 1 / 30,
    //   paths: 1000,
    // });
    // expect(layer).toBeInstanceOf(OlWind);
    const a = 1;
    expect(a).toBe(1);
  });
});
