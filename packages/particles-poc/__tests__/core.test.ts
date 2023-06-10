import { test, expect, describe, beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  console.log(`[wind-gl-core]: start testing...`);
});

afterAll(async () => {
  console.log(`[wind-gl-core]: test end`);
});

describe('utils', async () => {
  test('isNumber', async () => {
    expect(1).toBe(1);
  });
});
