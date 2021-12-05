import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { isNumber } from '../';

beforeAll(async () => {
  console.log(`[wind-gl-core]: start testing...`);
});

afterAll(async () => {
  console.log(`[wind-gl-core]: test end`);
});

describe('utils', async () => {
  test('isNumber', async () => {
    expect(isNumber(1)).toBe(true);
  });
});
