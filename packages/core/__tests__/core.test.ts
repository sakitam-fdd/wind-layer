import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { isFunction } from '../src';

beforeAll(async () => {
  console.log(`[wind-core]: start testing...`);
});

afterAll(async () => {
  console.log(`[wind-core]: test end`);
});

describe('utils', async () => {
  test('isFunction', async () => {
    expect(isFunction(1)).toBe(false);
  });
});
