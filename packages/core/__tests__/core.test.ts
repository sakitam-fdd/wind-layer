import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { isFunction, compareVersion } from '../src';

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

  test('compareVersion', async () => {
    expect(compareVersion('2.0.0', '2.0.0') >= 0).toBe(true);
    expect(compareVersion('2.0', '2.0.0') >= 0).toBe(true);
    expect(compareVersion('1.0', '2.0.0') >= 0).toBe(false);
  });
});
