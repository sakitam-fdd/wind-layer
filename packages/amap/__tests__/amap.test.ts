import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import AMapWind from '../src';

beforeAll(async () => {
  console.log(`[amap-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[amap-wind]: test end`);
});

describe('utils', async () => {
  test('isNumber', async () => {
    expect(AMapWind).toBe(true);
  });
});
