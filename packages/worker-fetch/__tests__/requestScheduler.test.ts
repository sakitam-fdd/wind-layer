import { test, expect, describe } from 'vitest';
import exported from '../src';

describe('RequestScheduler', async () => {
  test('instance', async () => {
    const layer = new exported.RequestScheduler({
      maxRequests: 6,
    });
    expect(layer).toBeInstanceOf(exported.RequestScheduler);
  });
});
