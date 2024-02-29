import { test, expect, describe, beforeAll, afterAll, vi } from 'vitest';

vi.stubGlobal(
  'URL',
  vi.mocked({
    createObjectURL: vi.fn(),
  }),
);

beforeAll(async () => {
  console.log(`[mapbox-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[mapbox-wind]: test end`);
});

describe('mapbox-gl', async () => {
  test('instance', async () => {
    expect(1).toEqual(1);
  });
});
