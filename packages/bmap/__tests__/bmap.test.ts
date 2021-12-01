import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import BMapWind from '../src';

beforeAll(async () => {
  console.log(`[bmap-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[bmap-wind]: test end`);
});

describe('utils', async () => {
  test('isNumber', async () => {
    expect(BMapWind).toBe(true);
  });
});
