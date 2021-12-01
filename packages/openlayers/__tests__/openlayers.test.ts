import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import OlWind from '../src';

beforeAll(async () => {
  console.log(`[openlayers-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[openlayers-wind]: test end`);
});

describe('utils', async () => {
  test('isFunction', async () => {
    expect(OlWind).toBe(false);
  });
});
