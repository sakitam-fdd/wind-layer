import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import OlWind from '../src';

beforeAll(async () => {
  console.log(`[maptalks-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[maptalks-wind]: test end`);
});

describe('utils', async () => {
  test('isFunction', async () => {
    expect(OlWind).toBe(false);
  });
});
